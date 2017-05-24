(function() {
    'use strict';

    function companyService(notifier, $http, constants, $log, $q, authService, $rootScope) {

        var baseURL = constants.APP_SERVER;

        function showError(message) {
            notifier.error(message.data.err);
        }

        function createCompany(companyData, picture) {
            return $http.post(baseURL + '/companies', companyData)
                .then(function(response) {
                    authService.updateCurrentUser(response.data.user);
                    // console.log(response.data.user);
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error creating a company: ' + response.statusText);
                    return $q.reject('Error creating a company.');
                });
        }

        function uploadPicture(company, picture) {
            var fd = new FormData();
            fd.append('picture', picture.upload);

            return $http.post(baseURL + '/companies/' + company._id + '/uploadPicture', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                .then(function(response) {
                    var user = authService.getCurrentUser();
                    var companies = user.companies;

                    for (var i = 0; i < companies.length; i++) {
                        if (companies[i]._id === company._id) {
                            user.companies[i] = response.data.company;
                            authService.updateCurrentUser(user);
                            break;
                        }
                    }

                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error uploading picture: ' + response.statusText);
                    return $q.reject('Error uploading picture.');
                });
        }

        function getCompanyByName(companyName) {
            $rootScope.companyName = companyName;
            return $http.get(baseURL + '/companies/getByName/' + companyName)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error creating a company: ' + response.statusText);
                    return $q.reject('Error creating a company.');
                });
        }

        function updateCompany(company) {
            return $http.put(baseURL + '/companies/' + company._id, company)
                .then(function(response) {
                    var user = authService.getCurrentUser();
                    var companies = user.companies;

                    for (var i = 0; i < companies.length; i++) {
                        if (companies[i]._id === company._id) {
                            user.companies[i] = company;
                            authService.updateCurrentUser(user);
                            break;
                        }
                    }

                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error updating the company: ' + response.statusText);
                    return $q.reject('Error updating the company.');
                });
        }

        return {
            createCompany: createCompany,
            uploadPicture: uploadPicture,
            getCompanyByName: getCompanyByName,
            updateCompany: updateCompany
        };
    }

    angular.module('sande')
        .factory('companyService', ['notifier', '$http', 'constants', '$log', '$q', 'authService', '$rootScope', companyService]);

}());