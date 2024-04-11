window.DeleteGioHang = function ($scope, $http, $routeParams, $location) {
  let abc = $routeParams.id;
  $http.delete(`${giohangAPI}/${abc}`).then(function (response) {
    $scope.cart = response.data;
    $location.path("gio-hang");
    alert("Xóa thành công");
  });
};
