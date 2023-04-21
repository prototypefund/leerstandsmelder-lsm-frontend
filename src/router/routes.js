const MyPlaces = () => import("../views/MyPlaces.vue");
const Chart = () => import("../views/Chart.vue");
const Map = () => import("../views/Map.vue");
const Form = () => import("../views/Form.vue");
const News = () => import("../views/News.vue");
const Register = () => import("../views/Users/Register.vue");
//const ForgotPassword = () => import("../views/Users/ForgotPassword.vue");
const ForgotPassword = () => import("../views/Users/ForgotPassword.vue");

const AdminDashboard = () => import("../views/Admin/Dashboard.vue");
const AdminRegions = () => import("../views/Admin/Regions.vue");
const AdminUsers = () => import("../views/Admin/Users.vue");
const AdminPlaces = () => import("../views/Admin/Places.vue");
const StyleGuide = () => import("../views/Styleguide.vue");

const routes = [
  {
    path: "/",
    name: "home",
    title: "site.subnav.home",
    icon: "mdi-home",
    component: () => import("../views/Home.vue"),
    meta: {
      title: "site.subnav.home",
      requiresAuth: false,
      always: true,
    },
  },
  {
    path: "/:region",
    name: "region",
    icon: "mdi-home",
    component: () => import("../views/Region.vue"),
    meta: {
      title: "site.subnav.region",
      requiresAuth: false,
    },
  },
  {
    path: "/:region/:slug",
    name: "region-place",
    icon: "mdi-home",
    component: () => import("../views/Place.vue"),
    meta: {
      title: "site.subnav.region",
      requiresAuth: false,
    },
  },
  {
    path: "/details/:slug",
    name: "place-detail",
    icon: "mdi-pencil",
    component: () => import("../views/Place.vue"),
    meta: {
      title: "menu.detail",
      requiresAuth: false,
    },
  },

  // {
  //   path: "/div",
  //   name: "divider-admin",
  //   title: "site.subnav.information",
  //   meta: {
  //     requiresAuth: false,
  //   },
  // },
  {
    path: "/map",
    name: "map",
    icon: "mdi-map",
    title: "menu.map",
    component: Map,
    meta: {
      title: "menu.map",
      always: true,
    },
  },
  {
    name: "map-show",
    path: "/map/:slug",
    component: Map,
    props: true,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/form",
    name: "form",
    icon: "mdi-pencil",
    title: "menu.form",
    component: Form,
    meta: {
      title: "menu.form",
      requiresAuth: true,
      always: true,
    },
  },
  {
    path: "/form/:slug",
    name: "form-detail",
    icon: "mdi-pencil",
    component: Form,
    meta: {
      title: "menu.form_edit",
      requiresAuth: true,
    },
  },
  {
    path: "/chart",
    name: "chart",
    icon: "mdi-chart-line",
    title: "menu.statistic",
    component: Chart,
    meta: {
      title: "menu.statistic",
      requiresAuth: true,
      requiresRole: "admin",
    },
  },

  {
    path: "/login",
    name: "login",
    icon: "mdi-login",
    title: "users.login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "users.login",
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "register",
    icon: "mdi-account-plus",
    title: "users.register",
    component: () => import("../views/Users/Register.vue"),
    meta: {
      title: "users.register",
      requiresAuth: false,
    },
  },
  {
    path: "/confirm/:token/:email",
    name: "confirmation",
    component: () => import("../views/Users/Register.vue"),
    meta: {
      title: "users.confirmation",
      requiresAuth: false,
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    icon: "mdi-login",
    component: () => import("../views/Users/ForgotPassword.vue"),
    meta: {
      title: "users.forgot",
      requiresAuth: false,
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    icon: "mdi-login",
    component: () => import("../views/Users/ResetPassword.vue"),
    meta: {
      title: "users.reset",
      requiresAuth: false,
    },
  },
  {
    path: "/profile",
    name: "profile",
    icon: "mdi-account",
    //title: "menu.profil",
    component: () => import("../views/Profile.vue"),
    meta: {
      title: "menu.profile",
      requiresAuth: true,
    },
  },
  {
    path: "/my-locations",
    name: "my-locations",
    icon: "mdi-marker",
    //title: "menu.my-locations",
    component: MyPlaces,
    meta: {
      title: "menu.my-locations",
      requiresAuth: true,
    },
  },

  {
    path: "/div2",
    name: "divider-admin",
    title: "menu.admin",
    meta: {
      title: "menu.admin",
      requiresAuth: true,
      requiresRole: "admin",
    },
  },
  {
    path: "/admin",
    name: "admin_dashboard",
    icon: "mdi-chart-line",
    title: "menu.admin_menu.dashboard",
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
      requiresRole: "admin",
    },
    children: [],
  },
  {
    path: "/admin/regions",
    name: "admin_region",
    icon: "mdi-chart-line",
    title: "menu.admin_menu.regions",

    component: AdminRegions,
    meta: {
      title: "menu.admin_menu.regions",
      requiresAuth: true,
      requiresRole: "admin",
    },
  },
  {
    path: "/admin/users",
    name: "admin_users",
    icon: "mdi-chart-line",
    title: "menu.admin_menu.users",

    component: AdminUsers,
    meta: {
      title: "menu.admin_menu.users",
      requiresAuth: true,
      requiresRole: "admin",
    },
  },
  {
    path: "/admin/locations",
    name: "admin_locations",
    icon: "mdi-chart-line",
    title: "menu.admin_menu.locations",

    component: AdminPlaces,
    meta: {
      title: "menu.admin_menu.locations",
      requiresAuth: true,
      requiresRole: "admin",
    },
  },
  {
    path: "/admin/styleguide",
    name: "Styleguide",
    icon: "mdi-newspaper",
    title: "menu.styleguide",
    component: StyleGuide,
    meta: {
      title: "menu.styleguide",
      requiresAuth: true,
      requiresRole: "admin",
    },
  },

  // {
  //   path: "/https://www.leerstandsmelder.de",
  //   href: true,
  //   name: "leerstandsmelder",
  //   title: "site.name",
  //   icon: "open-in-new",
  //   meta: {
  //     title: "site.name",
  //     requiresAuth: false,
  //   },
  // },

  {
    path: "/div2",
    name: "divider-admin",
    title: "menu.content",
    meta: {
      title: "menu.content",
      content: true,
    },
  },
  {
    path: "/news",
    name: "news",
    icon: "mdi-newspaper",
    title: "menu.news",
    component: News,
    meta: {
      title: "menu.news",
      content: true,
    },
  },
  {
    path: "/article/:slug",
    name: "article",
    icon: "mdi-newspaper",
    component: News,
    meta: {
      title: "menu.article",
      content: true,
    },
  },

  // {
  //   name: "site-content",
  //   path: "/site/:slug",
  //   component: SiteContent,
  //   props: true,
  //   meta: {
  //     requiresAuth: false,
  //   },
  // },
];

export default routes;
