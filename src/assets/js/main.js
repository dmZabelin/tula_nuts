document.addEventListener('DOMContentLoaded', () => {

// -> Global var
	const paddingOffset = window.innerWidth - document.body.offsetWidth;
	const header = document.querySelector('header');
	const main = document.querySelector('main');
	const logo = document.querySelector('.header__logo');
	const anchors = document.querySelectorAll('.scroll a');
	const upBtn = document.querySelector('.arrow-up');
	const offerBtn = document.querySelector('.offer__btn');
	const btnGroup = document.querySelector('.btn-group');
	const menu = document.querySelector('.menu');
	const burgerBtn = document.querySelector('.header__burger');
	const submenuBtn = document.querySelectorAll('.open-sub > a');
	const textWrapper = document.querySelector('.animate-title');
	const aboutDescrTitle = document.querySelector('.description__title');
	const aboutDescrText = document.querySelector('.description__txt');
	const cardSliderLeft = document.querySelector('.card__images_left');
	const cardSliderRight = document.querySelector('.card__images_right');
	const heroSlider = document.querySelector('.hero__slider');
	const playBtn = document.querySelector('.offer__play');

// Centered header
	const centeredBlock = (el) => {
		const elementWidth = el.offsetWidth/2;
		el.style.cssText =`
			margin-left: -${elementWidth}px;
			left: 50%;
		  `;
	}

// -> Smooth scrolling
	window.addEventListener('load', () => {
		centeredBlock(header);
		centeredBlock(btnGroup);
		if(!document.location.hash) return;
		const blockID = document.location.hash;
		const id = blockID.split('#')[1];
		scrollTo(id);
	})

	window.addEventListener("resize", () => {
		centeredBlock(header);
		centeredBlock(btnGroup);
	});

// Title H1 animated
	textWrapper.innerHTML = textWrapper.textContent
		.replace(/\S/g, "<span class=\"letter\">$&</span>");

	anime.timeline({loop: false})
		.add({
			targets: ".animate-title .letter",
			opacity: [0,1],
			easing: "easeInOutQuad",
			duration: 300,
			delay: (el, i) => 50 * (i+1)
		})

	if(document.body.classList.contains('home')) {
		for (let anchor of anchors) {
			anchor.addEventListener("click", function (e) {
				e.preventDefault();
				const blockID = anchor.getAttribute("href");
				if (!!blockID.indexOf('#')) {
					const id = blockID.split('#')[1];
					scrollTo(id);
				}
				burgerBtn.classList.remove('active');
				menu.classList.remove('show');
				document.body.classList.remove('hidden');
				removeIndent();
				setTimeout(() => {
					menu.removeAttribute('style');
				}, 500)
			});
		}
	}

	// -> button-up hidden/show
	window.addEventListener("scroll", function() {
		upBtn.hidden = (window.scrollY < 500);
	});

	const getHref = (e) => {
		e.preventDefault();
		const blockID = e.target.getAttribute("href");
		const id = blockID.split('#')[1];
		scrollTo(id);
	}

	if(offerBtn) {
		offerBtn.addEventListener('click', getHref)
	}
	upBtn.addEventListener('click', getHref);

	const scrollTo = (id) => {
		const yOffset = -130;
		const element = document.getElementById(id);
		const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
		window.scrollTo({top: y, behavior: 'smooth'});
	}

// -> Menu
	burgerBtn.addEventListener('click', function () {
		setTimeout(() => {
			this.classList.toggle('active');
		}, 250)
		document.body.classList.add('hidden');
		document.body.style.paddingRight = `${paddingOffset}px`
		addIndent();
		menu.classList.toggle('show');
		if(menu.classList.contains('show')) {
			menu.style.right = `${(document.body.offsetWidth - main.offsetWidth)/2}px`;
		} else {
			document.body.classList.remove('hidden');
			removeIndent();
			setTimeout(() => {
				menu.removeAttribute('style');
			}, 500)
		}
	})
	submenuBtn.forEach( el => {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			el.classList.toggle('active');
			e.path[1].children[1].classList.toggle('show');
		})
	});

	const addIndent = () => {
		if(paddingOffset > 0) {
			burgerBtn.style.right = (5.9 + paddingOffset / 10) + 'rem';
		}
		logo.style.marginLeft = '-' + paddingOffset / 10 + 'rem';
		btnGroup.style.marginLeft = '-' + ((btnGroup.offsetWidth/2) + paddingOffset) + 'px';
		btnGroup.hidden = true;
	}

	const removeIndent = () => {
		if(paddingOffset > 0)
			burgerBtn.style.right = 5 + 'rem';
		logo.removeAttribute('style');
		btnGroup.style.marginLeft = '-' + btnGroup.offsetWidth/2 + 'px';
		document.body.removeAttribute('style');
		setTimeout(() => {
			btnGroup.hidden = false;
		}, 250);
	}

// -> Custom scroll
	new SimpleBar(document.querySelector('.menu'));

// -> Sliders
	if(heroSlider) {
		new Swiper('.hero__slider', {
			loop: true,
			autoplay: {
				delay: 7000,
			},
			speed: 3000,
			effect: "fade",
		});
	}

	if(cardSliderLeft) {
		new Swiper('.card__images_left', {
			loop: true,
			autoplay: {
				delay: 5000,
			},
			speed: 3000,
			effect: "fade",
		});
	}

	if(cardSliderRight) {
		new Swiper('.card__images_right', {
			loop: true,
			autoplay: {
				delay: 3000,
			},
			speed: 3000,
			effect: "fade",
		});
	}

// -> Tab About
	if(aboutDescrTitle) {
		aboutDescrTitle.addEventListener('click', function (e) {
			aboutDescrTitle.classList.toggle('active');
			aboutDescrText.classList.toggle('show');
		})
	}

// -> Margin
	if(playBtn) {
		fsLightboxInstances['video'].props.onOpen = () => {
			addIndent();
		}
		fsLightboxInstances['video'].props.onClose = () => {
			removeIndent();
		}
	}

// -> Animation numbers
	function outNum(num, elem, time, step) {
		const e = document.querySelector(elem);
		let n = 0;
		const t = Math.round(time/(num/step));
		const interval = setInterval(() => {
			n = n + step;
			if(n == num) {
				clearInterval(interval);
			}
			e.innerHTML = n;
		},	t);
	}

// -> Intersection Observer API
	const options = {
		root: null,
		rootMargin: '0px',
		threshold: 0.1
	}
	const callback = function(entries, observer) {
		entries.forEach(entry => {
			if(entry.intersectionRatio !== 0) {
				if(entry.target.classList.contains('progress')) {
					outNum(30, '.card__number_first', 2000, 1);
					outNum(30, '.card__number_second', 2000, 1);
					outNum(300, '.card__number_third', 2000, 10);
					outNum(500, '.card__number_four', 2000, 10);
					observer.unobserve(entry.target)
				} else {
					entry.target.classList.add('animate');
					observer.unobserve(entry.target)
				}
			}
		});
	};
	const observer = new IntersectionObserver(callback, options);
	const targets = document.querySelectorAll('.scroll-effects');
	targets.forEach((el) => {
		observer.observe(el);
	})
});
