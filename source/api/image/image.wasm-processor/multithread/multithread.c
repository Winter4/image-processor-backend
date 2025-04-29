#include <math.h>
#include <stdlib.h>
#include <pthread.h>

// Структура данных для передачи в поток
typedef struct {
    const unsigned char* input;
    unsigned char* output;
    int width;
    int height;
    const double* kernel;
    int kernelSize;
    int startRow;
    int endRow;
} ThreadData;

// Создаём ядро Гаусса
void createGaussianKernel(int size, double sigma, double* kernel) {
    int halfSize = size / 2;
    double sigma2 = sigma * sigma;
    double normalization = 1.0 / (2.0 * M_PI * sigma2);

    double sum = 0.0;
    for (int y = -halfSize; y <= halfSize; y++) {
        for (int x = -halfSize; x <= halfSize; x++) {
            double value = normalization * exp(-(x * x + y * y) / (2 * sigma2));
            kernel[(y + halfSize) * size + (x + halfSize)] = value;
            sum += value;
        }
    }

    for (int i = 0; i < size * size; i++) {
        kernel[i] /= sum;
    }
}

// Применяем ядро к пикселям
void applyKernel(
    const unsigned char* input,
    unsigned char* output,
    int x, int y,
    int width, int height,
    const double* kernel,
    int kernelSize
) {
    int halfSize = kernelSize / 2;
    double r = 0, g = 0, b = 0;

    for (int ky = -halfSize; ky <= halfSize; ky++) {
        for (int kx = -halfSize; kx <= halfSize; kx++) {
            int iy = y + ky;
            int ix = x + kx;
            if (iy >= 0 && iy < height && ix >= 0 && ix < width) {
                int i = (iy * width + ix) * 3;

                double kernelValue = kernel[(ky + halfSize) * kernelSize + (kx + halfSize)];
                r += input[i] * kernelValue;
                g += input[i + 1] * kernelValue;
                b += input[i + 2] * kernelValue;
            }
        }
    }

    int i = (y * width + x) * 3;
    output[i] = (unsigned char)r;
    output[i + 1] = (unsigned char)g;
    output[i + 2] = (unsigned char)b;
}

// Функция, выполняемая в каждом потоке
void* threadWorker(void* arg) {
    ThreadData* data = (ThreadData*)arg;

    for (int y = data->startRow; y < data->endRow; y++) {
        for (int x = 0; x < data->width; x++) {
            applyKernel(
                data->input,
                data->output,
                x,
                y,
                data->width,
                data->height,
                data->kernel,
                data->kernelSize
            );
        }
    }

    return NULL;
}

// Основная функция обработки изображения
void processImage(
    const unsigned char* input,
    unsigned char* output,
    int width,
    int height,
    int kernelSize,
    double sigma
) {
    double* kernel = (double*)malloc(kernelSize * kernelSize * sizeof(double));
    createGaussianKernel(kernelSize, sigma, kernel);

    int numThreads = 4; // Количество потоков
    pthread_t threads[numThreads];
    ThreadData threadData[numThreads];

    int rowsPerThread = height / numThreads;

    for (int i = 0; i < numThreads; i++) {
        threadData[i].input = input;
        threadData[i].output = output;
        threadData[i].width = width;
        threadData[i].height = height;
        threadData[i].kernel = kernel;
        threadData[i].kernelSize = kernelSize;
        threadData[i].startRow = i * rowsPerThread;
        threadData[i].endRow = (i == numThreads - 1) ? height : (i + 1) * rowsPerThread;

        pthread_create(&threads[i], NULL, threadWorker, &threadData[i]);
    }

    for (int i = 0; i < numThreads; i++) {
        pthread_join(threads[i], NULL);
    }

    free(kernel);
}
