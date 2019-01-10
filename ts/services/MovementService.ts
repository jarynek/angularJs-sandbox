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

        if (event.which !== 1) {
            return;
        }

        let target = event.target;
        this.options.el = target.closest('[ng-mousedown]');
        let parent = this.options.el.parentNode;
        this.options.left = event.pageX - (this.options.el.getBoundingClientRect().left - parent.getBoundingClientRect().left);
        this.options.top = event.pageY - (this.options.el.getBoundingClientRect().top - parent.getBoundingClientRect().top);
        this.options.init = true;

        document.getElementsByTagName('body')[0].classList.add('drag');
    }

    /**
     *
     * @param el
     * @param parent
     * @param area
     * @private
     */
    _placeholder(el: any, parent: any, area: any) {

        if (document.getElementsByClassName('placeholder').length > 0) {
            document.getElementsByClassName('placeholder')[0].remove();
        }

        let placeholder = document.createElement('li');
        placeholder.className = 'placeholder';
        placeholder.setAttribute('style', 'height: ' + el.getBoundingClientRect().height + 'px; width:' + el.getBoundingClientRect().width + 'px');

        if (area == 'after') {
            parent.parentNode.insertBefore(placeholder, parent.nextSibling);
            return;
        }
        parent.parentNode.insertBefore(placeholder, parent);
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
                    let bodyRect = Math.abs(document.body.getBoundingClientRect().top);

                    let left = event.pageX - this.options.left;
                    let top = event.pageY - this.options.top;

                    if (active.length > 0) {
                        active[0].classList.remove('active');
                    }

                    if (el && this.options.el) {

                        /**
                         * add class active
                         */
                        if (this.options.el !== el) {
                            el.classList.add('active');
                        }

                        let surface = (el.getBoundingClientRect().top + bodyRect) + (el.getBoundingClientRect().height / 2);

                        if (event.pageY < surface) {
                            this._placeholder(this.options.el, el, 'before');
                        } else if (event.pageY > surface) {
                            this._placeholder(this.options.el, el, 'after');
                        }
                    }

                    this.options.el.setAttribute('style', 'position:absolute; pointer-events:none; left:' + left + 'px; top: ' + top + 'px');
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
                    let placeholder = document.querySelectorAll('.placeholder');
                    let active = document.querySelectorAll('.active');

                    /**
                     * Replace placeholder by el and remove placeholder
                     */
                    if (placeholder.length > 0) {
                        placeholder[0].parentNode.insertBefore(this.options.el, placeholder[0]);
                        placeholder[0].remove();
                    }

                    if (active.length > 0) {
                        active[0].remove();
                    }

                    let els = document.querySelectorAll('[data-user]');

                    /**
                     * Reindex object
                     */
                    els.forEach((el: any, index: any) => {
                        let id = el.getAttribute('data-user');
                        this.scope.users.filter((user: any) => {
                            if (user.id == id) {
                                console.log(user);
                                user.index = index;
                            }
                        });
                    });

                    this.scope.$apply(this.scope.users);
                    this.scope.usersStorage.setItem('users', JSON.stringify(this.scope.users));
                    this.options.el.setAttribute('style', '');
                    this.scope.users.filter((user: any) => {
                        if (user.id == id) {
                            user.test = this.counter++;
                        }
                    });
                    this.options.init = false;
                    movement = null;
                }
            });
        }
    }
}
