'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nestjs-intro documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-1ad2a815eef773efd71e4033a67e5b56e4e156e63b0bd614682e2ceede4735fe800a0e54b4751b2a91f6675f254e30af0a270b8294a7da413150343dad333145"' : 'data-bs-target="#xs-controllers-links-module-AppModule-1ad2a815eef773efd71e4033a67e5b56e4e156e63b0bd614682e2ceede4735fe800a0e54b4751b2a91f6675f254e30af0a270b8294a7da413150343dad333145"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-1ad2a815eef773efd71e4033a67e5b56e4e156e63b0bd614682e2ceede4735fe800a0e54b4751b2a91f6675f254e30af0a270b8294a7da413150343dad333145"' :
                                            'id="xs-controllers-links-module-AppModule-1ad2a815eef773efd71e4033a67e5b56e4e156e63b0bd614682e2ceede4735fe800a0e54b4751b2a91f6675f254e30af0a270b8294a7da413150343dad333145"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-1ad2a815eef773efd71e4033a67e5b56e4e156e63b0bd614682e2ceede4735fe800a0e54b4751b2a91f6675f254e30af0a270b8294a7da413150343dad333145"' : 'data-bs-target="#xs-injectables-links-module-AppModule-1ad2a815eef773efd71e4033a67e5b56e4e156e63b0bd614682e2ceede4735fe800a0e54b4751b2a91f6675f254e30af0a270b8294a7da413150343dad333145"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-1ad2a815eef773efd71e4033a67e5b56e4e156e63b0bd614682e2ceede4735fe800a0e54b4751b2a91f6675f254e30af0a270b8294a7da413150343dad333145"' :
                                        'id="xs-injectables-links-module-AppModule-1ad2a815eef773efd71e4033a67e5b56e4e156e63b0bd614682e2ceede4735fe800a0e54b4751b2a91f6675f254e30af0a270b8294a7da413150343dad333145"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-e200b7516475768697088fcf0f5bd48cfbd4bfce9a64728e6228af73880b4bb9274428229969b2657105cccd320d710694f0ff064d039abd1b9c6b83bca7bc65"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-e200b7516475768697088fcf0f5bd48cfbd4bfce9a64728e6228af73880b4bb9274428229969b2657105cccd320d710694f0ff064d039abd1b9c6b83bca7bc65"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-e200b7516475768697088fcf0f5bd48cfbd4bfce9a64728e6228af73880b4bb9274428229969b2657105cccd320d710694f0ff064d039abd1b9c6b83bca7bc65"' :
                                            'id="xs-controllers-links-module-AuthModule-e200b7516475768697088fcf0f5bd48cfbd4bfce9a64728e6228af73880b4bb9274428229969b2657105cccd320d710694f0ff064d039abd1b9c6b83bca7bc65"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-e200b7516475768697088fcf0f5bd48cfbd4bfce9a64728e6228af73880b4bb9274428229969b2657105cccd320d710694f0ff064d039abd1b9c6b83bca7bc65"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-e200b7516475768697088fcf0f5bd48cfbd4bfce9a64728e6228af73880b4bb9274428229969b2657105cccd320d710694f0ff064d039abd1b9c6b83bca7bc65"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-e200b7516475768697088fcf0f5bd48cfbd4bfce9a64728e6228af73880b4bb9274428229969b2657105cccd320d710694f0ff064d039abd1b9c6b83bca7bc65"' :
                                        'id="xs-injectables-links-module-AuthModule-e200b7516475768697088fcf0f5bd48cfbd4bfce9a64728e6228af73880b4bb9274428229969b2657105cccd320d710694f0ff064d039abd1b9c6b83bca7bc65"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PostsModule.html" data-type="entity-link" >PostsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PostsModule-ae4221da3f39e208aff7962de2ca4cc06e40d8fdf1187b7b2ef4f9c94ebe401c4657380099348f543a29eccaac471f545bfba38fd484155b01b712a9fad64f54"' : 'data-bs-target="#xs-controllers-links-module-PostsModule-ae4221da3f39e208aff7962de2ca4cc06e40d8fdf1187b7b2ef4f9c94ebe401c4657380099348f543a29eccaac471f545bfba38fd484155b01b712a9fad64f54"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PostsModule-ae4221da3f39e208aff7962de2ca4cc06e40d8fdf1187b7b2ef4f9c94ebe401c4657380099348f543a29eccaac471f545bfba38fd484155b01b712a9fad64f54"' :
                                            'id="xs-controllers-links-module-PostsModule-ae4221da3f39e208aff7962de2ca4cc06e40d8fdf1187b7b2ef4f9c94ebe401c4657380099348f543a29eccaac471f545bfba38fd484155b01b712a9fad64f54"' }>
                                            <li class="link">
                                                <a href="controllers/PostsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PostsModule-ae4221da3f39e208aff7962de2ca4cc06e40d8fdf1187b7b2ef4f9c94ebe401c4657380099348f543a29eccaac471f545bfba38fd484155b01b712a9fad64f54"' : 'data-bs-target="#xs-injectables-links-module-PostsModule-ae4221da3f39e208aff7962de2ca4cc06e40d8fdf1187b7b2ef4f9c94ebe401c4657380099348f543a29eccaac471f545bfba38fd484155b01b712a9fad64f54"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PostsModule-ae4221da3f39e208aff7962de2ca4cc06e40d8fdf1187b7b2ef4f9c94ebe401c4657380099348f543a29eccaac471f545bfba38fd484155b01b712a9fad64f54"' :
                                        'id="xs-injectables-links-module-PostsModule-ae4221da3f39e208aff7962de2ca4cc06e40d8fdf1187b7b2ef4f9c94ebe401c4657380099348f543a29eccaac471f545bfba38fd484155b01b712a9fad64f54"' }>
                                        <li class="link">
                                            <a href="injectables/PostsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-d3df5960fec4603438e2b16c6b9f8688163edf9f95ae7cad07dd8ccbdfc3bcccb48db02f919ac1f4fd33b08fb695c3a7d5f24128ecf4b5160e32b9a5df208bca"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-d3df5960fec4603438e2b16c6b9f8688163edf9f95ae7cad07dd8ccbdfc3bcccb48db02f919ac1f4fd33b08fb695c3a7d5f24128ecf4b5160e32b9a5df208bca"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-d3df5960fec4603438e2b16c6b9f8688163edf9f95ae7cad07dd8ccbdfc3bcccb48db02f919ac1f4fd33b08fb695c3a7d5f24128ecf4b5160e32b9a5df208bca"' :
                                            'id="xs-controllers-links-module-UsersModule-d3df5960fec4603438e2b16c6b9f8688163edf9f95ae7cad07dd8ccbdfc3bcccb48db02f919ac1f4fd33b08fb695c3a7d5f24128ecf4b5160e32b9a5df208bca"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-d3df5960fec4603438e2b16c6b9f8688163edf9f95ae7cad07dd8ccbdfc3bcccb48db02f919ac1f4fd33b08fb695c3a7d5f24128ecf4b5160e32b9a5df208bca"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-d3df5960fec4603438e2b16c6b9f8688163edf9f95ae7cad07dd8ccbdfc3bcccb48db02f919ac1f4fd33b08fb695c3a7d5f24128ecf4b5160e32b9a5df208bca"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-d3df5960fec4603438e2b16c6b9f8688163edf9f95ae7cad07dd8ccbdfc3bcccb48db02f919ac1f4fd33b08fb695c3a7d5f24128ecf4b5160e32b9a5df208bca"' :
                                        'id="xs-injectables-links-module-UsersModule-d3df5960fec4603438e2b16c6b9f8688163edf9f95ae7cad07dd8ccbdfc3bcccb48db02f919ac1f4fd33b08fb695c3a7d5f24128ecf4b5160e32b9a5df208bca"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreatePostDto.html" data-type="entity-link" >CreatePostDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePostMetaOptionsDto.html" data-type="entity-link" >CreatePostMetaOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUsersParamDto.html" data-type="entity-link" >GetUsersParamDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatchPostDto.html" data-type="entity-link" >PatchPostDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatchUserDto.html" data-type="entity-link" >PatchUserDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});