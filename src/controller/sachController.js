window.SachController = function (
  $scope,
  $http,
  $routeParams,
  $rootScope,
  $location
) {
  $scope.sachs = [];

  $http.get(sachAPI).then(function (response) {
    if (response.statusText === "OK") {
      $scope.sachs = response.data;
    }
  });

  //sắp xếp
  $scope.orderType = "name";
  $scope.orderProduct = function (type) {
    $scope.orderType = type;
  };

  //update
  $scope.id = $routeParams.id;
  $scope.formSP = {
    id: "",
    images: "",
    name: "",
    list_price: 0,
    short_description: "",
  };
  $http.get(sachAPI + "/" + $scope.id).then(function (response) {
    $scope.formSP = response.data;
  });

  $scope.updateSP = function () {
    if (!$scope.formSP.name) {
      alert("Tên sách không được để trống");
    } else if (!/^[a-zA-Z0-9\s()]+/.test($scope.formSP.name)) {
      alert("Tên sách không được chứa ký tự đặc biệt");
    } else if (!$scope.formSP.list_price) {
      alert("Giá sách không được để trống");
    } else if (isNaN($scope.formSP.list_price)) {
      alert("Giá sách phải nhập là số");
    } else if ($scope.formSP.list_price <= 0) {
      alert("Giá sách phải > 0");
    } else if (!$scope.formSP.images) {
      alert("Link ảnh không được để trống");
    } else if (!$scope.formSP.short_description) {
      alert("Mô tả không được để trống");
    } else {
      $scope.formSP.list_price = parseInt($scope.formSP.list_price, 10);
      $http.put(sachAPI + "/" + $scope.id, $scope.formSP).then(function () {
        alert("Sửa thành công");
        window.location.href = "#admin";
      });
    }
  };

  //details
  $rootScope.danhSachDetails = [];
  $http.get(sachAPI).then(
    function (response) {
      if (response.statusText === "OK") {
        $rootScope.sachAPI = response.data;
        $scope.sachAPI.forEach((sp) => {
          if (sp.id == $routeParams.id) {
            $scope.sp = angular.copy(sp);
          }
        });
      }
    },
    function (e) {
      console.log(e);
    }
  );

  //delete
  $scope.deleteSP = function (event, index) {
    event.preventDefault();
    let sp = $scope.sachs[index];
    let api = sachAPI + "/" + sp.id;
    $http.delete(api).then(function () {
      $scope.sachs.splice(index, 1);
      alert("Xóa thành công ");
    });
  };

  //add
  $scope.addSP = function (event) {
    event.preventDefault();
    if (!$scope.formSP.name) {
      alert("Tên sách không được để trống");
    } else if (!/^[a-zA-Z0-9\s()]+/.test($scope.formSP.name)) {
      alert("Tên sách không được chứa ký tự đặc biệt");
    } else if (!$scope.formSP.list_price) {
      alert("Giá sách không được để trống");
    } else if (isNaN($scope.formSP.list_price)) {
      alert("Giá sách phải nhập là số");
    } else if ($scope.formSP.list_price <= 0) {
      alert("Giá sách phải > 0");
    } else if (!$scope.formSP.images) {
      alert("Link ảnh không được để trống");
    } else if (!$scope.formSP.short_description) {
      alert("Mô tả không được để trống");
    } else {
      $scope.formSP.list_price = parseInt($scope.formSP.list_price, 10);
      $http.post(sachAPI, $scope.formSP).then(function (response) {
        $scope.sachs.push(response.data);
        alert("Thêm thành công");
        window.location.href = "#admin";
      });
    }
  };

  //search
  $scope.searchTerm = "";
  $scope.search = function () {
    // lấy yêu cầu GET tới db.json
    $http.get("http://localhost:3000/books").then(function (response) {
      // Khi yêu cầu thành công
      var dssach = response.data;
      // Lọc kết quả dựa trên search term
      $scope.sachs = dssach.filter(function (item) {
        return (
          item.name.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) !==
          -1
        );
      });
    });
  };

  // giỏ hàng
  $scope.cart = [];

  $http.get(giohangAPI).then(function (response) {
    if (response.statusText === "OK") {
      $scope.cart = response.data;
    }
  });

  //add
  $scope.addToCart = function (product) {
    // Hàm để tìm kiếm sản phẩm trong giỏ hàng
    var spgh = $scope.cart.find(function (item) {
      return item.id === product.id;
    });

    if (spgh) {
      //giỏ hàng có sản phẩm r thì +1
      spgh.quantity += 1;
      $http.put(giohangAPI + "/" + spgh.id, spgh).then(function () {
        alert("Sản phẩm đã được thêm vào giỏ hàng");
      });
    } else {
      // giỏ hàng chưa có thì add
      product.quantity = 1;
      $http.post(giohangAPI, product).then(function (response) {
        $scope.cart.push(response.data);
        alert("Sản phẩm đã được thêm vào giỏ hàng");
      });
    }
  };

  $scope.sum = function () {
    var total = 0;
    for (var i = 0; i < $scope.cart.length; i++) {
      total += $scope.cart[i].list_price * $scope.cart[i].quantity;
    }
    return total;
  };
  $scope.updateSL = function (item) {
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    $scope.total = $scope.sum();
  };

  $scope.formThanhToan = false;
  $scope.pay = {};
  $scope.checkout = function () {
    $scope.formThanhToan = true;
  };

  $scope.pays = [];
  $scope.thanhtoan = function () {
    $http
      .post(thanhtoanAPI, {
        pay: $scope.pay,
        cart: $scope.cart,
      })
      .then(function (response) {
        $scope.pays.push(response.data);
        alert("Thanh toán thành công");
        $scope.formThanhToan = false;
        $scope.pay = {};
        $scope.cart = [];
      });
  };
  $scope.countItemsInCart = function () {
    return $scope.cart.length;
  };
};
