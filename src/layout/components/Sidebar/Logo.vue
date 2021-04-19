<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-area" to="/">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      </div>
      <div v-else key="expand" class="sidebar-logo-area" to="/">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <user-info></user-info>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger';
import UserInfo from './User';

export default {
  name: 'SidebarLogo',
  components: {
    Hamburger,
    UserInfo
  },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Mogu'
    };
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  // background: #eee;
  text-align: center;
  overflow: hidden;
  & .sidebar-logo-area {
    height: 100%;
    width: 100%;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #666;
    & .hamburger-container {
      cursor: pointer;
    }
  }
  // &.collapse {
  // }
}
</style>
