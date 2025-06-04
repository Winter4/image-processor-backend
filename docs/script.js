/* eslint-disable no-undef */

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.section-content');

tabs.forEach(tab=> {
	tab.addEventListener('click', () => {
		tabs.forEach(t=> t.classList.remove('active'));
		contents.forEach(c => c.classList.remove('active'));

		tab.classList.add('active');
		const target = tab.dataset.tab;
		document.getElementById(target).classList.add('active');
	});
});

const sections = document.querySelectorAll('section, header, footer');
const navLinks = document.querySelectorAll('nav a');

const observer = new IntersectionObserver(
	entries => {
		entries.forEach(entry => {
			if(entry.isIntersecting) {
				navLinks.forEach(link => {
					link.classList.toggle(
						'active',
						link.getAttribute('href') === `#${entry.target.id}`
					);
				});
			}
		});
	},
	{
		threshold: 0.05,
	}
);

sections.forEach(section => {
	observer.observe(section);
});
