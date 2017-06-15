(function() {
    'use strict';

    function companyService(notifier, $http, constants, $log, $q, authService, $rootScope) {

        var baseURL = constants.APP_SERVER;

        function showError(message) {
            notifier.error(message.data.err);
        }

        function createCompany(companyData) {
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

        function searchCompaniesByName(companyName) {
            return $http.get(baseURL + '/companies/searchByName/' + companyName)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error getting companies: ' + response.statusText);
                    return $q.reject('Error getting companies.');
                });
        }

        function getCompanyByName(companyName) {
            $rootScope.companyName = companyName;
            return $http.get(baseURL + '/companies/getByName/' + companyName)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error getting the company: ' + response.statusText);
                    return $q.reject('Error getting the company.');
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

        function addCompanyProduct(companyId, productData) {
            return $http.post(baseURL + '/companies/' + companyId + '/products', productData)
                .then(function(response) {
                    // console.log(response.data.user);
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error posting a company product: ' + response.statusText);
                    return $q.reject('Error posting a company product.');
                });
        }

        function editCompanyProduct(companyId, productData) {
            return $http.put(baseURL + '/companies/' + companyId + '/products/' + productData._id, productData)
                .then(function(response) {
                    // console.log(response.data.user);
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error edting the company product: ' + response.statusText);
                    return $q.reject('Error editing the company product.');
                });
        }

        function deleteCompanyProduct(companyId, productId) {
            return $http.delete(baseURL + '/companies/' + companyId + '/products/' + productId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error deleting a company product: ' + response.statusText);
                    return $q.reject('Error deleting a company product.');
                });
        }

        function addCompanyProductImage(company, product, picture) {
            var fd = new FormData();
            fd.append('picture', picture.upload);

            return $http.post(baseURL + '/companies/' + company._id + '/products/' + product._id + '/uploadNewPicture', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error uploading picture: ' + response.statusText);
                    return $q.reject('Error uploading picture.');
                });
        }

        function addCompanyService(companyId, serviceData) {
            return $http.post(baseURL + '/companies/' + companyId + '/services', serviceData)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error posting a company service: ' + response.statusText);
                    return $q.reject('Error posting a company service.');
                });
        }

        function editCompanyService(companyId, serviceData) {
            return $http.put(baseURL + '/companies/' + companyId + '/services/' + serviceData._id, serviceData)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error editing a company service: ' + response.statusText);
                    return $q.reject('Error editing a company service.');
                });
        }

        function deleteCompanyService(companyId, serviceData) {
            return $http.delete(baseURL + '/companies/' + companyId + '/services/' + serviceData._id, serviceData)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error deleting a company service: ' + response.statusText);
                    return $q.reject('Error deleting a company service.');
                });
        }

        return {
            createCompany: createCompany,
            uploadPicture: uploadPicture,
            searchCompaniesByName: searchCompaniesByName,
            getCompanyByName: getCompanyByName,
            updateCompany: updateCompany,
            addCompanyProduct: addCompanyProduct,
            editCompanyProduct: editCompanyProduct,
            deleteCompanyProduct: deleteCompanyProduct,
            addCompanyProductImage: addCompanyProductImage,
            addCompanyService: addCompanyService,
            editCompanyService: editCompanyService,
            deleteCompanyService: deleteCompanyService
        };
    }

    angular.module('sande')
        .factory('companyService', ['notifier', '$http', 'constants', '$log', '$q', 'authService', '$rootScope', companyService]);

}());