(function() {
    'use strict';

    function CompanyProfileController($scope, authService, companyService, notifier, $log, $state, $timeout) {

        $scope.currentUser = authService.getCurrentUser();
        $scope.loading = false;
        $scope.picture = {};
        $scope.thumbnail = {
            available: false
        };

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        companyService.getCompanyByName($state.params.name)
            .then(function(response) {
                $scope.company = response;
            })
            .catch(showError);

        $scope.updateCompany = function() {
            $scope.loading = true;
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
    }

    angular.module('sande')
        .controller('CompanyProfileController', ['$scope', 'authService', 'companyService', 'notifier', '$log', '$state', '$timeout', CompanyProfileController]);

}());