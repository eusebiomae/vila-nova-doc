import VMasker from 'vanilla-masker';
import LazyLoad from "vanilla-lazyload";
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default.js';
import Splide from '@splidejs/splide';

require('bootstrap/js/dist/modal');

// variables
const ismobile = window.innerWidth <= 768;
const pageLazyLoad = new LazyLoad();

// document load
document.addEventListener("DOMContentLoaded", () => {

    // Toggle Menu Button
    on('.js-menu-toggle', 'click', () => {
        document.body.classList.toggle('menu-active');
        if (document.body.classList.contains('menu-active')) {
            window.location.hash = "menu";
        } else {
            history.pushState(null, null, '/');
        }
    })


    // Modal Contato
    on('.js-open-modal', 'click', (e) => {
        let tipo = e.currentTarget.getAttribute('data-modal-target');
        document.querySelector(`[data-modal-contato=${tipo}]`).classList.add('active');
        window.location.hash = "modal";
        e.preventDefault();
    })
    on('.js-close-modal', 'click', (e) => {
        e.currentTarget.closest('.modal-contato').classList.remove('active');
        history.pushState(null, null, '/');
        e.preventDefault();
    })

    window.onpopstate = function () {
        let open_modal = document.querySelector('.modal-contato.active');

        if (window.location.hash != '#menu') {
            document.body.classList.remove('menu-active');
        }

        if (window.location.hash != '#modal' && open_modal) {
            open_modal.classList.remove('active');
        }
    }


    // Tipo Contato
    on('.js-select-contato', 'change', (e) => {
        let select = e.currentTarget,
            form = select.closest('form'),
            required = select.options[select.selectedIndex].hasAttribute('data-tel-required')
            ;

        if (required) {
            form.Telefone.required = true;
            form.Telefone.parentElement.querySelector('label span').style.display = 'none';
        } else {
            form.Telefone.required = false;
            form.Telefone.parentElement.querySelector('label span').removeAttribute('style');
        }

        if (form.Telefone.classList.contains('is-valid') || form.Telefone.classList.contains('is-invalid')) {
            let event = new Event('blur');
            form.Telefone.dispatchEvent(event);
        }

    })


    // Validacao Form
    on('form[data-hubid-form]', 'submit', (e) => {
        e.preventDefault();
        let form = e.currentTarget;

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            form.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
        }
    })
    on('.form-control', 'blur', (e) => {
        let input = e.currentTarget,
            class_add = input.checkValidity() ? 'is-valid' : 'is-invalid',
            class_remove = input.checkValidity() ? 'is-invalid' : 'is-valid';

        if (input.closest('form').classList.contains('was-validated')) return;

        input.classList.remove(class_remove);
        input.classList.add(class_add);
    })


    // Mascara Telefone
    masked.tel('input[data-mask=tel]');


    // Carrossel
    document.querySelectorAll('.splide-images').forEach(el => {
        new Splide(el, {
            lazyLoad: true,
            focus: 'center',
            perPage: 3,
            fixedWidth: 765,
            trimSpace: false,
            updateOnMove: true,
            pagination: false,
            arrows: true,
            classes: {
                prev: 'splide__arrow--prev icon-prev',
                next: 'splide__arrow--next icon-next'
            },
            breakpoints: {
                640: {
                    perPage: 1,
                    padding: { right: '10%', left: 20 },
                    fixedWidth: false,
                    gap: 15,
                    arrows: false,
                    pagination: true
                }
            }
        }).mount();
    });


    // Abas
    document.querySelectorAll('[data-tab]').forEach(el => {
        el.querySelectorAll('[data-tab-index="0"]').forEach(el => el.classList.add('active'));

        on('.tab-btn', el, 'click', (e) => {
            let index = e.currentTarget.getAttribute('data-tab-index');
            el.querySelectorAll('[data-tab-index').forEach(el => el.classList.remove('active'));
            el.querySelectorAll(`[data-tab-index="${index}"]`).forEach(el => el.classList.add('active'));
        })

    })


    // Parallax
    document.querySelectorAll('.js-parallax').forEach(el => {
        let parallaxImg = () => {
            let speed = parseFloat(el.getAttribute('data-speed')) + 1;
            let winY = window.scrollY;
            if (winY > el.clientHeight) return;

            el.style.transform = 'translate3d(0,' + (winY / speed) + 'px, 0)'
        }

        document.addEventListener('scroll', parallaxImg);
        parallaxImg();
    })


    // Zoom Images
    on('.js-zoom', 'click', (e) => {
        zoomPhotoswipe(e.currentTarget);
        e.preventDefault();
    });


    // Button Play
    on('.js-play', 'click', (e) => {
        const iframe = e.currentTarget.nextElementSibling;
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
        e.currentTarget.classList.add('hide');
    })


    // Scroll To
    on('.menu-link, .js-scrollto', 'click', (e) => {
        const href = e.currentTarget.getAttribute('href');
        const pos = offset(document.querySelector(href)).top;
        document.body.classList.remove('menu-active');

        scroll({ top: pos, behavior: 'smooth' });
    });
})

/*
* name: on
* description: 
*/
const on = (...args) => {
    let selector = args[0],
        element = args.length == 4 ? args[1] : document,
        handler = args.pop(),
        event = args.pop()
        ;

    element.querySelectorAll(selector).forEach((target) => {
        target.addEventListener(event, handler)
    });
};

/*
* name: offset
* description: 
*/
const offset = (el) => {
    const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}


/*
* name: zoomPhotoswipe
* description: 
*/
const zoomPhotoswipe = (el) => {

    let
        grupo = el.getAttribute('data-zoom-group'),
        items = new Array(),
        index = parseInt(el.getAttribute('data-zoom-index'))
        ;

    document.querySelectorAll('[data-zoom-group="' + grupo + '"]').forEach((el) => {
        let size = el.getAttribute('data-zoom-size').split('x');

        let item = {
            src: el.getAttribute('href'),
            w: size[0],
            h: size[1],
            title: el.nextElementSibling.textContent
        }

        items.push(item);
    })

    if (document.querySelectorAll('.pswp').length == 0) insertModalPS();

    let pswpElement = document.querySelector('.pswp');

    let options = {
        index: index,
        closeOnScroll: false,
        loop: false,
        fullscreenEl: false,
        shareEl: false,
        arrowEl: !ismobile,
        errorMsg: '<div class="pswp__error-msg">Imagem não encontrada. <a href="%url%" target="_blank">Clique aqui</a> para abrir em uma nova aba.</div>'
    };

    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}

/*
* name: insertModalPS
* description: 
*/
const insertModalPS = () => {
    let html = `<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>
            <div class="pswp__ui pswp__ui--hidden">
                <div class="pswp__top-bar">
                    <div class="pswp__counter"></div>
                    <button class="pswp__button pswp__button--close" title="Fechar (Esc)"></button>
                    <button class="pswp__button pswp__button--share" title="Compartilhar"></button>
                    <button class="pswp__button pswp__button--fs" title="Fullscreen"></button>
                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                        <div class="pswp__preloader__cut">
                            <div class="pswp__preloader__donut"></div>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip"></div> 
                </div>
                <button class="pswp__button pswp__button--arrow--left" title="Voltar"></button>
                <button class="pswp__button pswp__button--arrow--right" title="Avançar"></button>
                <div class="pswp__caption">
                    <div class="pswp__caption__center"></div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
}

/*
* name: masked
* description: 
*/
const masked = {
    tel: (selector) => {
        const telMask = ['(99) 9999-99999', '(99) 99999-9999'];
        document.querySelectorAll(selector).forEach((el) => {
            VMasker(el).maskPattern(telMask[0]);
            el.addEventListener('input', masked.handler.bind(undefined, telMask, 14), false);
        });
    },
    handler: (masks, max, event) => {
        const c = event.target;
        const v = c.value.replace(/\D/g, '');
        const m = c.value.length > max ? 1 : 0;
        VMasker(c).unMask();
        VMasker(c).maskPattern(masks[m]);
        c.value = VMasker.toPattern(v, masks[m]);
    }
}

/*
* name: gaEvent
* description: 
*/
window.ga_event = (category, action, label) => {
    try {
        gtag('event', action, { event_category: category, event_label: label });
    } catch (e) {
        console.warn('GA não instalado.')
    }
}

/*
* name: Hubid
* description: 
*/
window.hubid_callback = (state, form, channel, message) => {
    let box_msg,
        tipo = form.getAttribute('data-tipo');

    if (!form.parentElement.querySelector('.box-mensagem')) {
        form.insertAdjacentHTML('afterend', '<div class="box-mensagem"></div>')
    }

    box_msg = form.parentElement.querySelector('.box-mensagem');

    const atualizaBoxMensagem = (titulo, texto) => {
        const html = `<div class="box-mensagem-ok">
		<span class="box-mensagem-tit">${titulo}</span>
		<span class="box-mensagem-texto">${texto}</span>
		<button class="btn">Voltar</button>
		</div>`;
        box_msg.innerHTML = html;
        box_msg.classList.remove('box-mensagem-load');

        on('.box-mensagem .btn', 'click', (e) => {
            e.preventDefault();
            box_msg.classList.remove('box-mensagem-ativo');
            setTimeout(() => box_msg.innerHTML = '', 200);
        });
    }

    switch (state) {
        case 'loading':
            box_msg.classList.add('box-mensagem-load', 'box-mensagem-ativo');
            break;
        case 'error':
            atualizaBoxMensagem('Falha no envio', message);
            break;
        case 'success':
            if (channel == 'mensagem') {
                atualizaBoxMensagem('Recebemos seu contato!', 'Aguarde nosso retorno em breve.');
            } else {
                atualizaBoxMensagem('Conversa iniciada!', 'Uma nova janela foi aberta. Caso não a visualize, desative o bloqueador de popup e tente novamente.');
            }

            ga_event('Contato', 'Sucesso ' + tipo);

            if (typeof fbq == 'function') fbq('track', 'Lead');

            break;
    }
}