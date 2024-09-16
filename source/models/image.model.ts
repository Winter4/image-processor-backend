import Entity from './base.model';

type ImageTable = {
    id: string;
    userId: string;
    title: string;
    data: Buffer;
    mimeType: string;
    handleType: string;
    md5: string;
    width: number;
    height: number;
    update: Date;
    created: Date;
};

class Image extends Entity<ImageTable> {
	table = 'images';
	name = 'Image';
}

export type {ImageTable};
export default new Image();
