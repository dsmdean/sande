(function() {
    'use strict';

    function CompanyProfileController($scope, authService, companyService, notifier, $log, $state, $timeout, eventService, $rootScope) {

        $scope.currentUser = authService.getCurrentUser();
        $scope.isCompanyAdmin = authService.isCompanyAdmin();
        $scope.loading = false;
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
        $scope.productPicture = {};
        $scope.productThumbnail = {
            available: false
        };
        // ADD SERVICE SECTION
        $scope.newService = {};
        // DETAILED SERVICE SECTION
        $scope.editService = false;
        $scope.detailedService = {};
        // EVENTS SECTION
        $scope.newEvent = {};

        $rootScope.$on('company:setCompanyAdmin', function() {
            $scope.isCompanyAdmin = authService.isCompanyAdmin();
        });

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        // GET COMPANY DATA
        companyService.getCompanyByName($state.params.name)
            .then(function(response) {
                $scope.company = response;
                authService.setCurrentCompany(response);

                if ($scope.company.settings.services === true && $scope.company.settings.products === true) {
                    $scope.company.offerSettings = "both";
                } else if ($scope.company.settings.services === false && $scope.company.settings.products === false) {
                    $scope.company.offerSettings = "none";
                } else if ($scope.company.settings.services === true) {
                    $scope.company.offerSettings = "services";
                } else if ($scope.company.settings.products === true) {
                    $scope.company.offerSettings = "products";
                }

                eventService.getCompanyEvents($scope.company._id)
                    .then(function(response) {
                        $scope.companyEvent = response;
                    })
                    .catch(showError);
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
                    $scope.editProduct = false;
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

        // PRODUCT IMAGE UPLOAD SECTION
        $scope.detailPhotoChanged = function(files) {
            // console.log(files);
            if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
                $scope.productUploading = true;
                var file = files[0];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function() {
                        $scope.productThumbnail.available = true;
                        $scope.productThumbnail.dataUrl = e.target.result;
                        $scope.productUploading = false;
                    });
                }
            } else {
                $scope.productThumbnail = {
                    available: false
                };
            }
        };

        $scope.addCompanyProductImage = function() {
            $scope.productUploading = true;
            $scope.loading = true;
            $("#addProductImageModal").hide();
            $(".modal-backdrop").hide();

            companyService.addCompanyProductImage($scope.company, $scope.detailedProduct, $scope.productPicture)
                .then(function(response) {
                    if (response.success) {
                        notifier.success(response.status);
                        $scope.company.products = response.products;
                        $scope.detailedProduct = response.product;
                    } else {
                        notifier.error(response.status);
                    }

                    $scope.productUploading = false;
                    $scope.productPicture = {};
                    $scope.loading = false;
                    $scope.productThumbnail = {
                        available: false
                    };
                })
                .catch(showError);
        };

        $scope.deleteProductImageModal = function(index) {
            if ($scope.detailedProduct.images.length > 1) {
                $scope.detailedProduct.images.splice(index, 1);
                $scope.editCompanyProduct();
            } else {
                notifier.error("Must add other picture before deleting this one!");
            }
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

        // DETAILED SERVICE SECTION
        $scope.toggleEditService = function() {
            $scope.editService = !$scope.editService;
        };

        $scope.editCompanyService = function(service) {
            $scope.loading = true;
            companyService.editCompanyService($scope.company._id, service)
                .then(function(response) {
                    $scope.loading = false;
                    notifier.success(response.status);
                    $scope.company.services = response.services;
                    $scope.editService = false;
                })
                .catch(showError);
        };

        $scope.setDeleteService = function(service) {
            $scope.detailedService = service;
        };

        $scope.deleteCompanyService = function() {
            $scope.loading = true;
            companyService.deleteCompanyService($scope.company._id, $scope.detailedService)
                .then(function(response) {
                    $scope.loading = false;
                    notifier.success(response.status);
                    $scope.company.services = response.services;
                    $scope.editService = false;
                })
                .catch(showError);
        };

        // EVENTS SECTION
        $scope.addEvent = function() {
            $scope.loading = true;
            $scope.newEvent.created = $scope.company._id;
            $scope.newEvent.creator = {};
            $scope.newEvent.creator.type = "Company";
            $scope.newEvent.creator.company = $scope.company._id;

            // $log.log($scope.newEvent);

            eventService.addEvent($scope.newEvent)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;
                    $scope.newEvent = {};
                    $scope.companyEvent.push(response.event);
                })
                .catch(showError);
        };

        $scope.setDetailedEvent = function(event) {
            $scope.detailedEvent = event;
        };

        $scope.updateEvent = function() {
            $scope.loading = true;
            eventService.updateEvent($scope.detailedEvent)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;

                    for (var i = 0; i < $scope.companyEvent.length; i++) {
                        if ($scope.companyEvent[i]._id === $scope.detailedEvent._id) {
                            $scope.companyEvent[i] = $scope.detailedEvent;
                            break;
                        }
                    }
                })
                .catch(showError);
        };

        $scope.deleteEvent = function() {
            $scope.loading = true;
            eventService.deleteEvent($scope.detailedEvent)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;

                    for (var i = 0; i < $scope.companyEvent.length; i++) {
                        if ($scope.companyEvent[i]._id === $scope.detailedEvent._id) {
                            $scope.companyEvent.splice(i, 1);
                            break;
                        }
                    }
                })
                .catch(showError);
        };

        $scope.getFutureEvents = function(event) {
            return Date.parse(event.date) > new Date();
        };
    }

    angular.module('sande')
        .controller('CompanyProfileController', ['$scope', 'authService', 'companyService', 'notifier', '$log', '$state', '$timeout', 'eventService', '$rootScope', CompanyProfileController]);

}());