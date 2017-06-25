(function() {
    'use strict';

    function CompanyCalendarController($scope, uiCalendarConfig, authService, eventService, notifier, companyService, $rootScope, $state) {

        $scope.currentCompany = authService.getCurrentCompany();
        $scope.isCompanyAdmin = authService.isCompanyAdmin();
        $scope.eventSources = [];
        $scope.SelectedEvent = null;
        var isFirstTime = true;
        $scope.events = [];
        $scope.eventSources = [$scope.events];
        $scope.newEvent = {};
        $scope.loading = false;

        $rootScope.$on('company:setCompanyAdmin', function() {
            $scope.isCompanyAdmin = authService.isCompanyAdmin();
        });

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        // function getDate(datetime) {
        //     if (datetime !== null) {
        //         var mili = datetime.replace(/\/Date\((-?\d+)\)\//, '$1');
        //         return new Date(parseInt(mili));
        //     } else {
        //         return "";
        //     }
        // }

        // function clearCalendar() {
        //     if (uiCalendarConfig.calendars.myCalendar !== null) {
        //         uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
        //         uiCalendarConfig.calendars.myCalendar.fullCalendar('unselect');
        //     }
        // }

        // GET COMPANY DATA
        companyService.getCompanyByName($state.params.name)
            .then(function(response) {
                $scope.currentCompany = response;

                // Get company events
                eventService.getCompanyEvents($scope.currentCompany._id)
                    .then(function(response) {
                        $scope.events.slice(0, $scope.events.length);
                        angular.forEach(response, function(value) {
                            if ($scope.isCompanyAdmin) {
                                $scope.events.push({
                                    _id: value._id,
                                    title: value.name,
                                    name: value.name,
                                    description: value.description,
                                    start: Date.parse(value.date),
                                    end: Date.parse(value.date),
                                    date: value.date,
                                    allDay: false,
                                    type: value.type,
                                    location: value.location,
                                    image: value.image,
                                    creator: value.creator,
                                    created: value.created,
                                    public: value.public
                                });
                            } else {
                                if (value.public) {
                                    $scope.events.push({
                                        _id: value._id,
                                        title: value.name,
                                        name: value.name,
                                        description: value.description,
                                        start: Date.parse(value.date),
                                        end: Date.parse(value.date),
                                        date: value.date,
                                        allDay: false,
                                        type: value.type,
                                        location: value.location,
                                        image: value.image,
                                        creator: value.creator,
                                        created: value.created,
                                        public: value.public
                                    });
                                }
                            }
                        });
                    })
                    .catch(showError);
            })
            .catch(showError);

        // config calendar
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                displayEventTime: false,
                header: {
                    // left: 'month basicWeek basicDay agendaWeek agendaDay',
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month agendaWeek agendaDay'
                },
                timeFormat: {
                    month: ' ',
                    agenda: 'h:mm t'
                },
                selectable: true,
                selectHelper: true,
                select: function(start, end) {
                    var fromDate = moment(event.start).format('YYYY/MM/DD LT');
                    var endDate = moment(event.end).format('YYYY/MM/DD LT');

                    if ($scope.isCompanyAdmin) {
                        $scope.newEvent = {
                            _id: event._id,
                            title: event.name,
                            name: event.name,
                            description: event.description,
                            start: Date.parse(event.date),
                            end: Date.parse(event.date),
                            date: end._d,
                            startDate: fromDate,
                            endDate: endDate,
                            allDay: false,
                            type: event.type,
                            location: event.location,
                            image: event.image,
                            creator: event.creator,
                            created: event.created,
                            public: event.public
                        };

                        $('#addEventModal').modal('show');
                    }
                },
                eventClick: function(event) {
                    $scope.SelectedEvent = event;
                },
                eventAfterAllRender: function() {
                    if ($scope.events.length > 0 && isFirstTime) {
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                    }
                }
            }
        };

        $scope.addEvent = function() {
            $scope.loading = true;
            $scope.newEvent.created = $scope.currentCompany._id;
            $scope.newEvent.creator = {};
            $scope.newEvent.creator.type = "Company";
            $scope.newEvent.creator.company = $scope.currentCompany._id;

            eventService.addEvent($scope.newEvent)
                .then(function(response) {
                    $scope.loading = false;
                    $scope.newEvent = {};
                    $scope.events.push({
                        _id: response.event._id,
                        title: response.event.name,
                        name: response.event.name,
                        description: response.event.description,
                        start: Date.parse(response.event.date),
                        end: Date.parse(response.event.date),
                        date: response.date,
                        allDay: false,
                        type: response.event.type,
                        location: response.event.location,
                        image: response.event.image,
                        creator: response.event.creator,
                        created: response.event.created,
                        public: response.event.public
                    });

                    $scope.SelectedEvent = $scope.events[$scope.events.length - 1];
                })
                .catch(showError);
        };

        $scope.updateEvent = function() {
            $scope.loading = true;
            eventService.updateEvent($scope.SelectedEvent)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;

                    for (var i = 0; i < $scope.events.length; i++) {
                        if ($scope.events[i]._id === $scope.SelectedEvent._id) {
                            $scope.events[i] = $scope.SelectedEvent;
                            break;
                        }
                    }
                })
                .catch(showError);
        };

        $scope.deleteEvent = function() {
            $scope.loading = true;
            eventService.deleteEvent($scope.SelectedEvent)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;

                    for (var i = 0; i < $scope.events.length; i++) {
                        if ($scope.events[i]._id === $scope.SelectedEvent._id) {
                            $scope.events.splice(i, 1);
                            break;
                        }
                    }

                    $scope.SelectedEvent = undefined;
                })
                .catch(showError);
        };
    }

    angular.module('sande')
        .controller('CompanyCalendarController', ['$scope', 'uiCalendarConfig', 'authService', 'eventService', 'notifier', 'companyService', '$rootScope', '$state', CompanyCalendarController]);

}());