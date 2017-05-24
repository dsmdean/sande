(function() {
    'use strict';

    function RegisterCompanyController($scope, authService, notifier, $rootScope, $state, companyCategoriesService, companyService, $timeout) {

        $scope.user = {};
        $scope.loading = false;
        $scope.picture = {};
        $scope.thumbnail = {
            available: false
        };
        $scope.categoryColors = ['emerald-bg', 'blue-bg', 'red-bg', 'purple-bg'];
        $scope.company = {};
        $scope.categoryTab = 'active';
        $scope.infoTab = '';

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        companyCategoriesService.getAllCompanyCategories()
            .then(function(response) {
                var j = 0;
                for (var i = 0; i < response.length; i++) {
                    if (j > 3) {
                        j = 0
                    }
                    response[i].color = $scope.categoryColors[j];
                    j++;
                }
                $scope.companyCategories = response;
            })
            .catch(showError);

        $scope.createCompany = function() {
            $scope.loading = true;
            companyService.createCompany($scope.company, $scope.picture)
                .then(function(response) {
                    if (response.success) {
                        notifier.success(response.status);
                        $state.reload();
                    } else {
                        notifier.error(response.status);
                    }
                    $scope.loading = false;
                })
                .catch(showError);
        };

        $scope.next = function() {
            $scope.categoryTab = '';
            $scope.infoTab = 'active';
        };

        $scope.previous = function() {
            $scope.categoryTab = 'active';
            $scope.infoTab = '';
        };

        $scope.getImage = function() {
            $('#choose-image').click();
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
    }

    angular.module('sande')
        .controller('RegisterCompanyController', ['$scope', 'authService', 'notifier', '$rootScope', '$state', 'companyCategoriesService', 'companyService', '$timeout', RegisterCompanyController]);

}());