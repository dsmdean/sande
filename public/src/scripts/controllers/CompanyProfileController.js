(function() {
    'use strict';

    function CompanyProfileController($scope, authService, companyService, notifier, $log, $state, $timeout) {

        $scope.currentUser = authService.getCurrentUser();
        $scope.loading = false;
        $scope.detailedProduct = {};
        $scope.picture = {};
        $scope.thumbnail = {
            available: false
        };
        $scope.newProduct = {
            options: []
        };
        $scope.newOption = false;

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        companyService.getCompanyByName($state.params.name)
            .then(function(response) {
                $scope.company = response;

                if ($scope.company.settings.services === true && $scope.company.settings.products === true) {
                    $scope.company.offerSettings = "both";
                } else if ($scope.company.settings.services === true) {
                    $scope.company.offerSettings = "services";
                } else if ($scope.company.settings.products === true) {
                    $scope.company.offerSettings = "products";
                }
            })
            .catch(showError);

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
            };

            companyService.updateCompany($scope.company)
                .then(function(response) {
                    notifier.success('Company updated!');
                    $scope.loading = false;
                })
                .catch(showError);
        };

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

        $scope.addCompanyProduct = function() {
            $scope.loading = true;
            companyService.addCompanyProduct($scope.company._id, $scope.newProduct)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;
                    $scope.company.products.push(response.product);
                    $scope.newProduct = {};
                })
                .catch(showError);
        };

        $scope.setDetailedProduct = function(product) {
            $scope.detailedProduct = product;
        }

        $scope.addOptiontoNewProduct = function() {
            $scope.newOption = true;
            $scope.newProduct.options.push({ name: '', options: '' });
        };

        $scope.optionsOptionProduct = function() {
            for (var i = 0; i < $scope.newProduct.options.length; i++) {
                if (!Array.isArray($scope.newProduct.options[i].options)) {
                    $scope.newProduct.options[i].options = $scope.newProduct.options[i].options.split(',');
                    $log.log($scope.newProduct);
                }
            }
        };
    }

    angular.module('sande')
        .controller('CompanyProfileController', ['$scope', 'authService', 'companyService', 'notifier', '$log', '$state', '$timeout', CompanyProfileController]);

}());