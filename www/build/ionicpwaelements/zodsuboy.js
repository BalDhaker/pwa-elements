/*! Built with http://stenciljs.com */
const{h,Context}=window.ionicpwaelements;let CSS_PROP=function(t){const e=["webkitTransform","-webkit-transform","webkit-transform","transform"].find(e=>void 0!==t.style[e])||"transform",s=["webkitTransition","transition"].find(e=>void 0!==t.style[e])||"transition",i=s.indexOf("webkit")>-1?"-webkit-":"";return{transitionDurationProp:i+"transition-duration",transitionTimingFnProp:i+"transition-timing-function",transformProp:e,transitionProp:s}}(document.documentElement),TRANSFORM_PROPS={translateX:1,translateY:1,translateZ:1,scale:1,scaleX:1,scaleY:1,scaleZ:1,rotate:1,rotateX:1,rotateY:1,rotateZ:1,skewX:1,skewY:1,perspective:1},CSS_VALUE_REGEX=/(^-?\d*\.?\d*)(.*)/,DURATION_MIN=32,TRANSITION_END_FALLBACK_PADDING_MS=400;function transitionEnd(t,e){let s,i;const n={passive:!0};function o(){i&&i(),s&&s()}function r(s){t===s.target&&(o(),e(s))}return t&&(t.addEventListener("webkitTransitionEnd",r,n),i=function(){t.removeEventListener("webkitTransitionEnd",r,n)},t.addEventListener("transitionend",r,n),s=function(){t.removeEventListener("transitionend",r,n)}),o}class Animator{constructor(){this._duration=null,this._easingName=null,this._elements=null,this._destroyed=!1,this.hasChildren=!1,this.isPlaying=!1,this.hasCompleted=!1}addElement(t){if(t)if(t.length)for(let e=0;e<t.length;e++)this._addEl(t[e]);else this._addEl(t);return this}_addEl(t){1===t.nodeType&&(this._elementTotal=(this._elements=this._elements||[]).push(t))}add(t){return t.parent=this,this.hasChildren=!0,this._childAnimationTotal=(this._childAnimations=this._childAnimations||[]).push(t),this}getDuration(t){return t&&null!==t.duration&&void 0!==t.duration?t.duration:null!==this._duration?this._duration:this.parent?this.parent.getDuration():0}isRoot(){return!this.parent}duration(t){return this._duration=t,this}getEasing(){return this._isReverse&&this._reversedEasingName?this._reversedEasingName:null!==this._easingName?this._easingName:this.parent&&this.parent.getEasing()||null}easing(t){return this._easingName=t,this}easingReverse(t){return this._reversedEasingName=t,this}from(t,e){return this._addProp("from",t,e),this}to(t,e,s){const i=this._addProp("to",t,e);return s&&this.afterClearStyles([i.trans?CSS_PROP.transformProp:t]),this}fromTo(t,e,s,i){return this.from(t,e).to(t,s,i)}_getProp(t){if(this._fxProperties)return this._fxProperties.find(e=>e.effectName===t);this._fxProperties=[]}_addProp(t,e,s){let i=this._getProp(e);if(!i){const t=1===TRANSFORM_PROPS[e];i={effectName:e,trans:t,wc:t?CSS_PROP.transformProp:e},this._fxProperties.push(i)}const n={val:s,num:null,effectUnit:""};if(i[t]=n,"string"==typeof s&&s.indexOf(" ")<0){const t=s.match(CSS_VALUE_REGEX),e=parseFloat(t[1]);isNaN(e)||(n.num=e),n.effectUnit=t[0]!==t[2]?t[2]:""}else"number"==typeof s&&(n.num=s);return i}beforeAddClass(t){return(this._beforeAddClasses=this._beforeAddClasses||[]).push(t),this}beforeRemoveClass(t){return(this._beforeRemoveClasses=this._beforeRemoveClasses||[]).push(t),this}beforeStyles(t){return this._beforeStyles=t,this}beforeClearStyles(t){this._beforeStyles=this._beforeStyles||{};for(let e=0;e<t.length;e++)this._beforeStyles[t[e]]="";return this}beforeAddRead(t){return(this._readCallbacks=this._readCallbacks||[]).push(t),this}beforeAddWrite(t){return(this._writeCallbacks=this._writeCallbacks||[]).push(t),this}afterAddClass(t){return(this._afterAddClasses=this._afterAddClasses||[]).push(t),this}afterRemoveClass(t){return(this._afterRemoveClasses=this._afterRemoveClasses||[]).push(t),this}afterStyles(t){return this._afterStyles=t,this}afterClearStyles(t){this._afterStyles=this._afterStyles||{};for(let e=0;e<t.length;e++)this._afterStyles[t[e]]="";return this}play(t){const e=this;e._destroyed||(e._isAsync=e._hasDuration(t),e._clearAsync(),e._playInit(t),window.requestAnimationFrame(function(){window.requestAnimationFrame(function(){e._playDomInspect(t)})}))}syncPlay(){if(!this._destroyed){const t={duration:0};this._isAsync=!1,this._clearAsync(),this._playInit(t),this._playDomInspect(t)}}_playInit(t){this._hasTweenEffect=!1,this.isPlaying=!0,this.hasCompleted=!1,this._hasDur=this.getDuration(t)>DURATION_MIN;const e=this._childAnimations;for(let s=0;s<this._childAnimationTotal;s++)e[s]._playInit(t);this._hasDur&&(this._progress(0),this._willChange(!0))}_playDomInspect(t){const e=this;e._beforeAnimation();const s=e.getDuration(t);e._isAsync&&e._asyncEnd(s,!0),e._playProgress(t),e._isAsync&&!this._destroyed&&window.requestAnimationFrame(function(){e._playToStep(1)})}_playProgress(t){const e=this._childAnimations;for(let s=0;s<this._childAnimationTotal;s++)e[s]._playProgress(t);this._hasDur?this._setTrans(this.getDuration(t),!1):(this._progress(1),this._setAfterStyles(),this._didFinish(!0))}_playToStep(t){if(!this._destroyed){const e=this._childAnimations;for(let s=0;s<this._childAnimationTotal;s++)e[s]._playToStep(t);this._hasDur&&this._progress(t)}}_asyncEnd(t,e){const s=this;s._unregisterTrnsEnd=transitionEnd(s._transEl(),function(){s._clearAsync(),s._playEnd(),s._didFinishAll(e,!0,!1)}),s._timerId=setTimeout(function(){console.debug("Animation onTransitionFallback, CSS onTransitionEnd did not fire!"),s._timerId=void 0,s._clearAsync(),s._playEnd(e?1:0),s._didFinishAll(e,!0,!1)},t+TRANSITION_END_FALLBACK_PADDING_MS)}_playEnd(t){const e=this._childAnimations;for(let s=0;s<this._childAnimationTotal;s++)e[s]._playEnd(t);this._hasDur&&(null!==t&&void 0!==t&&(this._setTrans(0,!0),this._progress(t)),this._setAfterStyles(),this._willChange(!1))}_hasDuration(t){if(this.getDuration(t)>DURATION_MIN)return!0;const e=this._childAnimations;for(let s=0;s<this._childAnimationTotal;s++)if(e[s]._hasDuration(t))return!0;return!1}_hasDomReads(){if(this._readCallbacks&&this._readCallbacks.length)return!0;const t=this._childAnimations;for(let e=0;e<this._childAnimationTotal;e++)if(t[e]._hasDomReads())return!0;return!1}stop(t){void 0===t&&(t=1),this._clearAsync(),this._hasDur=!0,this._playEnd(t)}_clearAsync(){this._unregisterTrnsEnd&&this._unregisterTrnsEnd(),this._timerId&&clearTimeout(this._timerId),this._timerId=this._unregisterTrnsEnd=void 0}_progress(t){let e;const s=this._elements,i=this._fxProperties,n=this._elementTotal;if(!s||!i||!n||this._destroyed)return;this._isReverse&&(t=1-t);let o,r=0,a=0,l="";for(r=0;r<i.length;r++)if((o=i[r]).from&&o.to){const i=o.from.num,r=o.to.num,h=i!==r;if(h&&(this._hasTweenEffect=!0),0===t)e=o.from.val;else if(1===t)e=o.to.val;else if(h){let s=(r-i)*t+i;const n=o.to.effectUnit;"px"===n&&(s=Math.round(s)),e=s+n}if(null!==e){const t=o.effectName;if(o.trans)l+=t+"("+e+") ";else for(a=0;a<n;a++)s[a].style[t]=e}}if(l.length)for((!this._isReverse&&1!==t||this._isReverse&&0!==t)&&(l+="translateZ(0px)"),r=0;r<s.length;r++)s[r].style[CSS_PROP.transformProp]=l}_setTrans(t,e){const s=this._elements,i=this._elementTotal;if(!s||!this._fxProperties||0===i)return;const n=e?"linear":this.getEasing(),o=t+"ms",r=CSS_PROP.transitionProp,a=CSS_PROP.transitionDurationProp,l=CSS_PROP.transitionTimingFnProp;let h;for(let e=0;e<i;e++)h=s[e].style,t>0?(h[r]="",h[a]=o,n&&(h[l]=n)):h[r]="none"}_beforeAnimation(){this._fireBeforeReadFunc(),this._fireBeforeWriteFunc(),this._setBeforeStyles()}_setBeforeStyles(){let t;const e=this._childAnimations;for(let t=0;t<this._childAnimationTotal;t++)e[t]._setBeforeStyles();const s=this._elements,i=this._elementTotal;if(!s||0===i||this._isReverse)return;const n=this._beforeAddClasses,o=this._beforeRemoveClasses;let r;for(let e=0;e<i;e++){const i=s[e],a=i.classList;if(n)for(t=0;t<n.length;t++)a.add(n[t]);if(o)for(t=0;t<o.length;t++)a.remove(o[t]);if(this._beforeStyles)for(r in this._beforeStyles)i.style[r]=this._beforeStyles[r]}}_fireBeforeReadFunc(){const t=this._childAnimations;let e=0;for(e=0;e<this._childAnimationTotal;e++)t[e]._fireBeforeReadFunc();const s=this._readCallbacks;if(s)for(e=0;e<s.length;e++)s[e]()}_fireBeforeWriteFunc(){const t=this._childAnimations;let e=0;for(e=0;e<this._childAnimationTotal;e++)t[e]._fireBeforeWriteFunc();const s=this._writeCallbacks;if(this._writeCallbacks)for(e=0;e<s.length;e++)s[e]()}_setAfterStyles(){let t,e,s,i;const n=this._elements;if(!n)return;let o;for(t=0;t<this._elementTotal;t++)if(i=(s=n[t]).classList,s.style[CSS_PROP.transitionDurationProp]=s.style[CSS_PROP.transitionTimingFnProp]="",this._isReverse){if(this._beforeAddClasses)for(e=0;e<this._beforeAddClasses.length;e++)i.remove(this._beforeAddClasses[e]);if(this._beforeRemoveClasses)for(e=0;e<this._beforeRemoveClasses.length;e++)i.add(this._beforeRemoveClasses[e]);if(this._beforeStyles)for(o in this._beforeStyles)s.style[o]=""}else{if(this._afterAddClasses)for(e=0;e<this._afterAddClasses.length;e++)i.add(this._afterAddClasses[e]);if(this._afterRemoveClasses)for(e=0;e<this._afterRemoveClasses.length;e++)i.remove(this._afterRemoveClasses[e]);if(this._afterStyles)for(o in this._afterStyles)s.style[o]=this._afterStyles[o]}}_willChange(t){let e,s=0;const i=this._fxProperties;let n;if(t&&i){for(e=[],s=0;s<i.length;s++){const t=i[s].wc;"webkitTransform"===t?e.push("transform","-webkit-transform"):e.push(t)}n=e.join(",")}else n="";for(s=0;s<this._elementTotal;s++)this._elements[s].style.willChange=n}progressStart(){this._clearAsync(),this._beforeAnimation(),this._progressStart()}_progressStart(){const t=this._childAnimations;for(let e=0;e<this._childAnimationTotal;e++)t[e]._progressStart();this._setTrans(0,!0),this._willChange(!0)}progressStep(t){t=Math.min(1,Math.max(0,t));const e=this._childAnimations;for(let s=0;s<this._childAnimationTotal;s++)e[s].progressStep(t);this._progress(t)}progressEnd(t,e,s){this._isReverse&&(e=-1*e+1);const i=t?1:0,n=Math.abs(e-i);void 0===s&&(s=-1),n<.05?s=0:s<0&&(s=this._duration),this._isAsync=s>30,this._progressEnd(t,i,s,this._isAsync),this._isAsync&&(this._asyncEnd(s,t),this._destroyed||window.requestAnimationFrame(()=>{this._playToStep(i)}))}_progressEnd(t,e,s,i){const n=this._childAnimations;for(let o=0;o<this._childAnimationTotal;o++)n[o]._progressEnd(t,e,s,i);i?(this.isPlaying=!0,this.hasCompleted=!1,this._hasDur=!0,this._willChange(!0),this._setTrans(s,!1)):(this._progress(e),this._willChange(!1),this._setAfterStyles(),this._didFinish(t))}onFinish(t,e){return e&&e.clearExistingCallacks&&(this._onFinishCallbacks=this._onFinishOneTimeCallbacks=void 0),e&&e.oneTimeCallback?(this._onFinishOneTimeCallbacks=this._onFinishOneTimeCallbacks||[],this._onFinishOneTimeCallbacks.push(t)):(this._onFinishCallbacks=this._onFinishCallbacks||[],this._onFinishCallbacks.push(t)),this}_didFinishAll(t,e,s){const i=this._childAnimations;for(let n=0;n<this._childAnimationTotal;n++)i[n]._didFinishAll(t,e,s);(e&&this._isAsync||s&&!this._isAsync)&&this._didFinish(t)}_didFinish(t){this.isPlaying=!1,this.hasCompleted=t;let e=0;if(this._onFinishCallbacks)for(e=0;e<this._onFinishCallbacks.length;e++)this._onFinishCallbacks[e](this);if(this._onFinishOneTimeCallbacks){for(e=0;e<this._onFinishOneTimeCallbacks.length;e++)this._onFinishOneTimeCallbacks[e](this);this._onFinishOneTimeCallbacks.length=0}}reverse(t){void 0===t&&(t=!0);const e=this._childAnimations;for(let s=0;s<this._childAnimationTotal;s++)e[s].reverse(t);return this._isReverse=t,this}destroy(){this._destroyed=!0;const t=this._childAnimations;for(let e=0;e<this._childAnimationTotal;e++)t[e].destroy();this._clearAsync(),this._elements&&(this._elements.length=this._elementTotal=0),this._readCallbacks&&(this._readCallbacks.length=0),this._writeCallbacks&&(this._writeCallbacks.length=0),this.parent=void 0,this._childAnimations&&(this._childAnimations.length=this._childAnimationTotal=0),this._onFinishCallbacks&&(this._onFinishCallbacks.length=0),this._onFinishOneTimeCallbacks&&(this._onFinishOneTimeCallbacks.length=0)}_transEl(){for(let t=0;t<this._childAnimationTotal;t++){const e=this._childAnimations[t]._transEl();if(e)return e}return this._hasTweenEffect&&this._hasDur&&this._elements&&this._elementTotal>0?this._elements[0]:null}create(){return new Animator}}class AnimationControllerImpl{create(t,e,s){return t?t(Animator,e,s):Promise.resolve(new Animator)}static get is(){return"ion-animation-controller"}static get properties(){return{create:{method:!0}}}}function isString(t){return"string"==typeof t}function playAnimationAsync(t){return new Promise(e=>{t.onFinish(t=>{e(t)}),t.play()})}function domControllerAsync(t,e){return new Promise(s=>{t(()=>{if(!e)return s();Promise.resolve(e()).then((...t)=>{s(t)})})})}class DomFrameworkDelegate{attachViewToDom(t,e,s={},i=[]){return new Promise(n=>{const o=isString(e)?document.createElement(e):e;if(Object.assign(o,s),i.length)for(const t of i)o.classList.add(t);t.appendChild(o),n({element:o,data:s,component:e})})}removeViewFromDom(t,e){return t.removeChild(e),Promise.resolve()}shouldDeferToRouter(t){return Promise.resolve(!1)}routeToUrl(t){return Promise.resolve("todo")}}function createThemedClasses(t,e,s){return s.split(" ").reduce((s,i)=>(s[i]=!0,t&&(s[`${i}-${t}`]=!0,e&&(s[`${i}-${e}`]=!0,s[`${i}-${t}-${e}`]=!0)),s),{})}function iosEnterAnimation(t,e){const s=new t,i=new t;i.addElement(e.querySelector(".modal-backdrop"));const n=new t;return n.addElement(e.querySelector(".modal-wrapper")),n.beforeStyles({opacity:1}).fromTo("translateY","100%","0%"),i.fromTo("opacity",.01,.4),Promise.resolve(s.addElement(e).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(400).beforeAddClass("show-modal").add(i).add(n))}function iosLeaveAnimation(t,e){const s=new t,i=new t;i.addElement(e.querySelector(".modal-backdrop"));const n=new t,o=e.querySelector(".modal-wrapper");n.addElement(o);const r=o.getBoundingClientRect();return n.beforeStyles({opacity:1}).fromTo("translateY","0%",`${window.innerHeight-r.top}px`),i.fromTo("opacity",.4,0),Promise.resolve(s.addElement(e).easing("ease-out").duration(250).add(i).add(n))}function mdEnterAnimation(t,e){const s=new t,i=new t;i.addElement(e.querySelector(".modal-backdrop"));const n=new t;return n.addElement(e.querySelector(".modal-wrapper")),n.fromTo("opacity",.01,1).fromTo("translateY","40px","0px"),i.fromTo("opacity",.01,.4),Promise.resolve(s.addElement(e).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(280).beforeAddClass("show-modal").add(i).add(n))}function mdLeaveAnimation(t,e){const s=new t,i=new t;i.addElement(e.querySelector(".modal-backdrop"));const n=new t,o=e.querySelector(".modal-wrapper");return n.addElement(o),n.fromTo("opacity",.99,0).fromTo("translateY","0px","40px"),i.fromTo("opacity",.4,0),Promise.resolve(s.addElement(e).easing("cubic-bezier(0.47,0,0.745,0.715)").duration(200).add(i).add(n))}class Modal{constructor(){this.data={},this.enableBackdropDismiss=!0,this.showBackdrop=!0,this.willAnimate=!0}present(){this.animation&&(this.animation.destroy(),this.animation=null),this.ionModalWillPresent.emit(),this.el.style.zIndex=`${2e4+this.modalId}`;const t=this.enterAnimation||this.config.get("modalEnter","ios"===this.mode?iosEnterAnimation:mdEnterAnimation),e=this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);this.delegate||(this.delegate=new DomFrameworkDelegate);const s=[];return this.cssClass&&this.cssClass.length&&s.push(this.cssClass),this.data=this.data||{},this.data.modal=this.el,this.delegate.attachViewToDom(e,this.component,this.data,s).then(t=>{this.usersComponentElement=t.element}),this.animationCtrl.create(t,this.el).then(t=>(this.animation=t,this.willAnimate||(this.animation=t.duration(0)),playAnimationAsync(t))).then(t=>{t.destroy(),this.ionModalDidPresent.emit()})}dismiss(t,e){this.animation&&(this.animation.destroy(),this.animation=null),this.ionModalWillDismiss.emit({data:t,role:e}),this.delegate||(this.delegate=new DomFrameworkDelegate);const s=this.leaveAnimation||this.config.get("modalLeave","ios"===this.mode?iosLeaveAnimation:mdLeaveAnimation);return this.animationCtrl.create(s,this.el).then(t=>(this.animation=t,this.willAnimate||(this.animation=t.duration(0)),playAnimationAsync(t))).then(s=>{s.destroy(),this.ionModalDidDismiss.emit({data:t,role:e})}).then(()=>domControllerAsync(this.dom.write,()=>{const t=this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);this.delegate.removeViewFromDom(t,this.usersComponentElement),this.el.parentNode.removeChild(this.el)}))}getUserComponentContainer(){return this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`)}onDismiss(t){t.stopPropagation(),t.preventDefault(),this.dismiss()}componentDidLoad(){this.ionModalDidLoad.emit()}componentDidUnload(){this.ionModalDidUnload.emit()}backdropClick(){this.enableBackdropDismiss&&this.dismiss()}render(){const t=createThemedClasses(this.mode,this.color,"modal-backdrop"),e=createThemedClasses(this.mode,this.color,"modal-wrapper");return[h("div",{onClick:this.backdropClick.bind(this),class:Object.assign({},t,{"hide-backdrop":!this.showBackdrop})}),h("div",{role:"dialog",class:e})]}static get is(){return"ion-modal"}static get host(){return{theme:"modal"}}static get properties(){return{animationCtrl:{connect:"ion-animation-controller"},color:{type:String,attr:"color"},component:{type:"Any",attr:"component"},config:{context:"config"},cssClass:{type:String,attr:"css-class"},data:{type:"Any",attr:"data"},delegate:{type:"Any",attr:"delegate",mutable:!0},dismiss:{method:!0},dom:{context:"dom"},el:{elementRef:!0},enableBackdropDismiss:{type:Boolean,attr:"enable-backdrop-dismiss"},enterAnimation:{type:"Any",attr:"enter-animation"},getUserComponentContainer:{method:!0},leaveAnimation:{type:"Any",attr:"leave-animation"},modalId:{type:Number,attr:"modal-id"},mode:{type:"Any",attr:"mode"},present:{method:!0},showBackdrop:{type:Boolean,attr:"show-backdrop"},willAnimate:{type:Boolean,attr:"will-animate"}}}static get events(){return[{name:"ionModalDidLoad",method:"ionModalDidLoad",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidPresent",method:"ionModalDidPresent",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalWillPresent",method:"ionModalWillPresent",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalWillDismiss",method:"ionModalWillDismiss",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidDismiss",method:"ionModalDidDismiss",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidUnload",method:"ionModalDidUnload",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return"ion-modal{left:0;top:0;position:absolute;display:block;width:100%;height:100%;contain:strict}ion-modal-controller{display:none}.modal-backdrop{left:0;top:0;position:absolute;z-index:2;display:block;width:100%;height:100%;opacity:.01;transform:translateZ(0)}\@media not all and (min-width:768px) and (min-height:600px){.modal-backdrop{visibility:hidden}}.modal-backdrop.backdrop-no-tappable{cursor:auto}.modal-backdrop.hide-backdrop{visibility:hidden}.modal-wrapper{z-index:10;height:100%;contain:strict}\@media only screen and (min-width:768px) and (min-height:600px){.modal-wrapper{left:calc(50% - (600px/2));top:calc(50% - (500px/2));position:absolute;width:600px;height:500px}}\@media only screen and (min-width:768px) and (min-height:768px){.modal-wrapper{left:calc(50% - (600px/2));top:calc(50% - (600px/2));position:absolute;width:600px;height:600px}}.modal-backdrop-md{background-color:var(--ion-backdrop-md-color,var(--ion-backdrop-color,#000))}.modal-wrapper-md{transform:translate3d(0,40px,0);opacity:.01}\@media only screen and (min-width:768px) and (min-height:600px){.modal-wrapper-md{border-radius:2px;overflow:hidden;box-shadow:0 28px 48px rgba(0,0,0,.4)}}"}static get styleMode(){return"md"}}const USER_COMPONENT_MODAL_CONTAINER_CLASS="modal-wrapper";let ids=0;const modals=new Map;class ModalController{create(t){const e=document.createElement("ion-modal");return e.modalId=ids++,Object.assign(e,t),(document.querySelector("ion-app")||document.body).appendChild(e),e.componentOnReady()}dismiss(t,e,s=-1){s=s>=0?s:getHighestId();const i=modals.get(s);return i?i.dismiss(t,e):Promise.reject("modal does not exist")}getTop(){return modals.get(getHighestId())}modalWillPresent(t){modals.set(t.target.modalId,t.target)}modalWillDismiss(t){modals.delete(t.target.modalId)}escapeKeyUp(){removeLastModal()}static get is(){return"ion-modal-controller"}static get properties(){return{create:{method:!0},dismiss:{method:!0},getTop:{method:!0}}}}function getHighestId(){let t=-1;return modals.forEach((e,s)=>{s>t&&(t=s)}),t}function removeLastModal(){const t=modals.get(getHighestId());return t?t.dismiss():Promise.resolve()}export{AnimationControllerImpl as IonAnimationController,Modal as IonModal,ModalController as IonModalController};