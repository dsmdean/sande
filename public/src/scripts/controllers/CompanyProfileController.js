(function() {
    'use strict';

    function CompanyProfileController($scope, authService, companyService, notifier, $log, $state, $timeout) {

        $scope.currentUser = authService.getCurrentUser();
        $scope.loading = true;
        // COMPANY IMAGE UPLOAD SECTION
        $scope.picture = {};
        $scope.thumbnail = {
            available: false
        };
        // ADD PRODUCT SECTION
        $scope.newProduct = {
            options: []
        };
        $scope.newOption = false;
        // DETAILED PRODUCT SECTION
        $scope.detailedProduct = {};
        $scope.editProduct = false;
        // ADD SERVICE SECTION
        $scope.newService = {};

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        // GET COMPANY DATA
        companyService.getCompanyByName($state.params.name)
            .then(function(response) {
                $scope.loading = false;
                $scope.company = response;

                if ($scope.company.settings.services === true && $scope.company.settings.products === true) {
                    $scope.company.offerSettings = "both";
                } else if ($scope.company.settings.services === false && $scope.company.settings.products === false) {
                    $scope.company.offerSettings = "none";
                } else if ($scope.company.settings.services === true) {
                    $scope.company.offerSettings = "services";
                } else if ($scope.company.settings.products === true) {
                    $scope.company.offerSettings = "products";
                }
            })
            .catch(showError);

        // SETTINGS SECTION
        $scope.updateCompany = function() {
            // $log.log($scope.company);
            $scope.loading = true;

            switch ($scope.company.offerSettings) {
                case "services":
                    $scope.company.settings.services = true;
                    $scope.company.settings.products = false;
                    break;
                case "products":
                    $scope.company.settings.products = true;
                    $scope.company.settings.services = false;
                    break;
                case "both":
                    $scope.company.settings.services = true;
                    $scope.company.settings.products = true;
                    break;
                case "none":
                    $scope.company.settings.services = false;
                    $scope.company.settings.products = false;
            };

            companyService.updateCompany($scope.company)
                .then(function(response) {
                    notifier.success('Company updated!');
                    $scope.loading = false;
                })
                .catch(showError);
        };

        // COMPANY IMAGE UPLOAD SECTION
        $scope.getImage = function() {
            $('#choose-image').click();
        };

        $scope.uploadPicture = function() {
            $scope.uploading = true;

            companyService.uploadPicture($scope.company, $scope.picture)
                .then(function(response) {
                    if (response.success) {
                        notifier.success(response.status);
                        $state.reload();
                    } else {
                        notifier.error(response.status);
                    }

                    $scope.uploading = false;
                    $scope.picture = {};
                })
                .catch(showError);
        };

        $scope.photoChanged = function(files) {
            // console.log(files);
            if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
                $scope.uploading = true;
                var file = files[0];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function() {
                        $scope.thumbnail.available = true;
                        $scope.thumbnail.dataUrl = e.target.result;
                        $scope.uploading = false;
                    });
                }
            } else {
                $scope.thumbnail = {
                    available: false
                };
            }
        };

        // ADD PRODUCT SECTION
        $scope.addCompanyProduct = function() {
            $scope.loading = true;
            companyService.addCompanyProduct($scope.company._id, $scope.newProduct)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;
                    $scope.company.products.push(response.product);
                    $scope.newProduct = {};
                    $scope.newOption = false;
                })
                .catch(showError);
        };

        $scope.addOptionToNewProduct = function() {
            $scope.newOption = true;
            $scope.newProduct.options.push({ name: '', options: '' });
        };

        $scope.addOptionsOptionToNewProduct = function() {
            for (var i = 0; i < $scope.newProduct.options.length; i++) {
                if (!Array.isArray($scope.newProduct.options[i].options)) {
                    $scope.newProduct.options[i].options = $scope.newProduct.options[i].options.split(',');
                    $log.log($scope.newProduct);
                }
            }
        };

        // DETAILED PRODUCT SECTION
        $scope.setDetailedProduct = function(product) {
            $scope.detailedProduct = product;
        }

        $scope.toggleEditProduct = function() {
            $scope.editProduct = !$scope.editProduct;
        };

        $scope.addOptionToDetailedProduct = function() {
            if (!Array.isArray($scope.detailedProduct.options)) {
                $scope.detailedProduct.options = [];
            }
            $scope.detailedProduct.options.push({ name: '', options: '' });
            // $log.log($scope.detailedProduct);
        };

        $scope.addOptionsOptionToDetailedProduct = function() {
            for (var i = 0; i < $scope.detailedProduct.options.length; i++) {
                if (!Array.isArray($scope.detailedProduct.options[i].options)) {
                    $scope.detailedProduct.options[i].options = $scope.detailedProduct.options[i].options.split(',');
                    $log.log($scope.detailedProduct);
                }
            }
        };

        $scope.deleteOptionDetailedProduct = function(index) {
            $scope.detailedProduct.options.splice(index, 1);
            $log.log($scope.detailedProduct);
        };

        $scope.editCompanyProduct = function() {
            // $log.log($scope.detailedProduct);

            $scope.loading = true;
            companyService.editCompanyProduct($scope.company._id, $scope.detailedProduct)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;
                    $scope.company.products = response.products;
                    $scope.detailedProduct = response.product;
                    $scope.toggleEditProduct();
                })
                .catch(showError);
        };

        $scope.deleteCompanyProduct = function() {
            $scope.loading = true;
            $(".modal-backdrop").hide();
            companyService.deleteCompanyProduct($scope.company._id, $scope.detailedProduct._id)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;
                    $scope.company.products = response.products;
                    $scope.detailedProduct = {};
                    $scope.editProduct = false;
                })
                .catch(showError);
        };

        // ADD SERVICE SECTION
        $scope.addCompanyService = function() {
            $scope.loading = true;
            companyService.addCompanyService($scope.company._id, $scope.newService)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;
                    $scope.company.services.push(response.service);
                    $scope.newService = {};
                })
                .catch(showError);
        };
    }

    angular.module('sande')
        .controller('CompanyProfileController', ['$scope', 'authService', 'companyService', 'notifier', '$log', '$state', '$timeout', CompanyProfileController]);

}());