var app = angular.module("myModule", ["ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/trangchu", {
      templateUrl: "pages/trangchu.html",
      controller: SachController,
    })
    .when("/detail/:id", {
      templateUrl: "pages/detail.html",
      controller: SachController,
    })
    .when("/admin", {
      templateUrl: "pages/dashboard.html",
      controller: SachController,
    })
    .when("/admin/add", {
      templateUrl: "pages/addsp.html",
      controller: SachController,
    })
    .when("/admin/update/:id", {
      templateUrl: "pages/updatesp.html",
      controller: SachController,
    })
    .when("/gio-hang", {
      templateUrl: "pages/giohang.html",
      controller: SachController,
    })
    .when("/gio-hang/delete/:id", {
      templateUrl: "pages/giohang.html",
      controller: DeleteGioHang,
    })
    .otherwise({
      redirectTo: "/trangchu",
    });
});
