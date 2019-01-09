/**
 * MovementService
 */
export class MovementService {

    scope: any;
    options: any;
    init: boolean;
    counter: any;

    constructor(scope: any) {

        this.options = {
            init: false,
            el: null,
            left: null,
            top: null
        };

        this.counter = 1;

        this.scope = scope;
        this._init();
        this._move();
        this._destroy();
    }

    /**
     * Drag
     */
    drag(event: any) {
        let target = event.target;
        this.options.el = target.closest('[ng-mousedown]');
        this.options.left = event.pageX - this.options.el.getBoundingClientRect().left;
        this.options.top = event.pageY - this.options.el.getBoundingClientRect().top;
        this.options.init = true;
    }

    /**
     * Init
     * @private
     */
    _init() {
        let body = document.getElementsByTagName('body');
        body[0].setAttribute('data-movement', 'move');
    }

    /**
     * Move
     * @private
     */
    _move() {
        let movement = document.querySelectorAll('[data-movement]');

        if (movement.length > 0) {
            movement[0].addEventListener('mousemove', (event: any) => {
                if (this.options.init === true && this.options.el) {

                    let target = event.target;
                    let el = target.closest('[ng-mousedown]');
                    let active = document.querySelectorAll('.active');

                    let left = event.pageX - this.options.left;
                    let top = event.pageY - this.options.top;

                    if(active.length > 0){
                        active[0].classList.remove('active');
                    }

                    if(el && this.options.el !== el){
                        el.classList.add('active');
                    }

                    this.options.el.setAttribute('style', 'position:fixed; pointer-events:none; left:' + left + 'px; top: ' + top + 'px');
                }
            });
        }
    }

    /**
     * _destroy
     * @private
     */
    _destroy() {
        let movement = document.querySelectorAll('[data-movement]');
        if (movement.length > 0) {
            movement[0].addEventListener('mouseup', (event: any) => {
                if (this.options.init === true) {
                    let id = this.options.el.getAttribute('data-user');
                    this.options.el.setAttribute('style', '');

                    this.scope.users.filter((user: any) => {
                        if (user.id == id) {
                            user.test = this.counter++;
                        }
                    });

                    this.options.init = false;
                }
            });
        }
    }
}
