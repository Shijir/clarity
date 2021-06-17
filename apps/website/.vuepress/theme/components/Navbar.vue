<template>
  <header class="header header-6" cds-layout="horizontal">
    <slot name="sidebar-toggle"></slot>
    <div class="branding">
      <RouterLink :to="$localePath" class="nav-link">
        <img class="logo" src="/images/clarity-logo.svg" :alt="$siteTitle" />
        <span v-if="$siteTitle" ref="siteName" class="title" :class="{ 'can-hide': $site.themeConfig.logo }">{{
          $siteTitle
        }}</span>
      </RouterLink>
    </div>

    <div class="header-nav"></div>

    <template>
      <AlgoliaSearchBox v-if="isAlgoliaSearch" :options="algolia" />
      <SearchBox v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false" />
    </template>
    <div class="site-switcher" cds-layout="align:right align:vertical-center m-r:md">
      <div class="dropdown bottom-left" :class="{ open: themeSwitcherOpen }">
        <button class="dropdown-toggle btn btn-link btn-inverse" type="button" @click="toggleThemeSwitcher()">
          <span cds-layout="p-r:sm">LIGHT THEME</span>
          <cds-icon shape="caret" direction="down" size="lg" inverse cds-layout="align:center"></cds-icon>
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item active" href="javascript: void(0)">Light Theme</a>
          <a class="dropdown-item">Dark Theme</a>
        </div>
      </div>

      <div class="dropdown bottom-right" :class="{ open: siteSwitcherOpen }">
        <button class="dropdown-toggle btn btn-link btn-inverse" type="button" @click="toggleSiteSwitcher()">
          <span cds-layout="p-r:sm">CLARITY CORE</span>
          <cds-icon shape="caret" direction="down" size="lg" inverse cds-layout="align:center"></cds-icon>
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item active" href="javascript: void(0)">Clarity Core</a>
          <a class="dropdown-item" v-bind:href="siteSwitchUrl" target="_blank"
            >Clarity Angular <cds-icon shape="pop-out"></cds-icon
          ></a>
          <div class="dropdown-divider" role="separator"></div>
          <div class="dropdown-item" href="javascript: void(0)">
            What are the differences? <cds-icon shape="pop-out"></cds-icon>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import AlgoliaSearchBox from '@AlgoliaSearchBox';
import SearchBox from '@SearchBox';

const defaultAngularSiteURL = 'https://60cba56fecae1119bbbbe47e--angular-clarity-design.netlify.app/';

export default {
  name: 'Navbar',

  components: {
    SearchBox,
    AlgoliaSearchBox,
  },

  data() {
    return {
      linksWrapMaxWidth: null,
      siteSwitcherOpen: false,
      themeSwitcherOpen: false,
      componentPath: null,
      siteSwitchUrl: defaultAngularSiteURL,
    };
  },

  computed: {
    algolia() {
      return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {};
    },

    isAlgoliaSearch() {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName;
    },
  },

  mounted() {
    if (typeof window !== 'undefined') {
      const MOBILE_DESKTOP_BREAKPOINT = 719; // refer to config.styl
      const NAVBAR_VERTICAL_PADDING = parseInt(css(this.$el, 'paddingLeft')) + parseInt(css(this.$el, 'paddingRight'));
      const handleLinksWrapWidth = () => {
        if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
          this.linksWrapMaxWidth = null;
        } else {
          this.linksWrapMaxWidth =
            this.$el.offsetWidth -
            NAVBAR_VERTICAL_PADDING -
            ((this.$refs.siteName && this.$refs.siteName.offsetWidth) || 0);
        }
      };
      handleLinksWrapWidth();
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleLinksWrapWidth, false);
      }
    }
  },
  methods: {
    toggleSiteSwitcher: function () {
      this.siteSwitcherOpen = !this.siteSwitcherOpen;
    },
    toggleThemeSwitcher: function () {
      this.themeSwitcherOpen = !this.themeSwitcherOpen;
    },
  },
  watch: {
    $route(to, from) {
      this.componentPath = to.path;

      this.siteSwitchUrl = defaultAngularSiteURL;

      if (this.componentPath === '/core-components/alert/') {
        this.siteSwitchUrl = defaultAngularSiteURL + 'documentation/alerts';
      }

      console.log(this.siteSwitchUrl);
    },
  },
};

function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView;
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property];
}
</script>

<style lang="scss">
.header .search {
  opacity: 1;
}
.header .logo {
  margin-right: 10px;
}
.main-container .header .branding {
  max-width: none;
}

// Search override: hide the divider
.header .search-box + .settings::after {
  display: none;
}

.site-switcher cds-select {
  text-transform: uppercase;
}

.dropdown-menu cds-icon {
  --color: var(--clr-dropdown-item-color, #666);
}
</style>
