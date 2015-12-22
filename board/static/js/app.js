/**
 * Created by reyrodrigues on 12/21/15.
 */


function removeHashkey(a) {
    delete a['$$hashKey'];
    return a;
}

window.RTL = ['ar', 'fa', 'ps', 'af'];

angular
    .module('BusBoard', ['ui.router', 'ui.sortable'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/colors");

        $stateProvider
            .state('colors', {
                url: "/colors",
                templateUrl: "colors.html",
                controller: "ColorController"
            })
            .state('text', {
                url: "/text",
                templateUrl: "text.html",
                controller: "TextController"
            })
            .state('admin', {
                url: "/admin",
                templateUrl: "admin.html",
                controller: "AdminController"
            });


        if (!localStorage.headerText) {
            localStorage.headerText = 'Header Text';
        }

        if (!localStorage.color) {
            localStorage.color = '#FFF';
        }

        if (!localStorage.rightHandText) {
            localStorage.rightHandText = 'Right Hand Text';
        }
    })
    .controller('ColorController', function ColorController($scope, $state, $rootScope, $timeout, $sce, $http) {
        $rootScope.title = 'Colors';
        $scope.languages = ['en', 'ar', 'fa'];
        $scope.currentLanguage = 0;

        function refreshData(argument) {
            $http.get('https://refugeeinfo.eu/api/locations/91/content/').then(function (r) {
                $scope.contents = r.data.content;
                console.log($scope.contents);
                var items = $scope.contents.en.contents;
                if (localStorage.indices) {
                    var selected = JSON.parse(localStorage.indices);
                    items.forEach(function (item, index) {
                        item.checked = selected.indexOf(index) > -1;
                        if (item.checked) {
                        }
                    });
                    var index = selected[0];
                    localStorage.item = JSON.stringify({
                        'en': $scope.contents.en.contents[index],
                        'ar': $scope.contents.ar.contents[index],
                        'fa': $scope.contents.fa.contents[index]
                        //'af': $scope.contents.af.contents[index],
                    });
                }
                $scope.items = items;
                var lang = $scope.languages[$scope.currentLanguage];

                $scope.direction = RTL.indexOf(lang) > -1 ? 'rtl' : 'ltr';

                $scope.icon = $scope.contents[lang].contents[0].icon;
                $scope.header = $scope.contents[lang].contents[0].title;

                $scope.content = $sce.trustAsHtml($scope.contents[lang].contents[0].body);

                if (($scope.currentLanguage + 1) == $scope.languages.length)
                    $scope.currentLanguage = 0;
                else
                    $scope.currentLanguage += 1;

                $timeout(refreshData, 30 * 1000);
            });
        }

        refreshData();

    })
    .controller('AdminController', function AdminController($scope, $state, $rootScope, $http) {
        $rootScope.title = 'Administration';
        var defaults = [
            {index: "0", color: "#4f8f00"},
            {index: "1", color: "#ffd300"},
            {index: "8", color: "#d4fb79"},
            {index: "9", color: "#37d100"}
        ];

        $scope.colors = JSON.parse(localStorage.colors || JSON.stringify(defaults));
        $scope.orderedColors = JSON.parse(localStorage.orderedColors || JSON.stringify($scope.colors));
        $scope.headerText = (localStorage.headerText || '');
        $scope.rightHandText = (localStorage.rightHandText || '');
        $scope.items = [];

        $scope.$watch('headerText', function () {
            localStorage.headerText = $scope.headerText;
        });
        $scope.$watch('rightHandText', function () {
            localStorage.rightHandText = $scope.rightHandText;
        });

        $scope.options = {
            language: 'en',
            toolbar: 'Full',
            enterMode: CKEDITOR.ENTER_BR,
            shiftEnterMode: CKEDITOR.ENTER_BR
        };

        $http.get('http://staging.refugeeinfo.eu/api/locations/91/content/').then(function (r) {
            $scope.contents = r.data.content;
            console.log($scope.contents);
            var items = $scope.contents.en.contents;
            if (localStorage.indices) {
                var selected = JSON.parse(localStorage.indices);
                items.forEach(function (item, index) {
                    item.checked = selected.indexOf(index) > -1;
                    if (item.checked) {
                    }
                });
                var index = selected[0];
                localStorage.item = JSON.stringify({
                    'en': $scope.contents.en.contents[index],
                    'ar': $scope.contents.ar.contents[index],
                    'fa': $scope.contents.fa.contents[index]
                    //'af': $scope.contents.af.contents[index],
                });
            }
            $scope.items = items;
        });


        $scope.orderedColors.sort(function (a, b) {
            return a.index > b.index;
        });
        $scope.sortableOptions = {
            stop: function (e, ui) {
                for (var index in $scope.orderedColors) {
                    $scope.orderedColors[index].index = index;
                }
                localStorage.orderedColors = JSON.stringify($scope.orderedColors.map(removeHashkey));
            }
        };
        $scope.addColor = function addColor(argument) {
            var possible = $scope.colors.filter(function (a) {
                return a.color == $scope.color
            });

            if (possible.length > 0 || !($scope.color)) {
                return;
            }


            $scope.colors.push({
                index: $scope.colors.length + 1,
                color: $scope.color
            });
            $scope.orderedColors.push({
                index: $scope.orderedColors.length + 1,
                color: $scope.color
            });
            localStorage.colors = JSON.stringify($scope.colors.map(removeHashkey));
            localStorage.orderedColors = JSON.stringify($scope.orderedColors.map(removeHashkey));
        };
        $scope.removeTop = function removeTop(color) {
            var temp = $scope.orderedColors.map(removeHashkey);
            var removed = temp.slice(0, 1);
            temp = temp.slice(1, temp.length);
            removed[0].index = temp.length + 2;

            temp.sort(function (a, b) {
                return a.index < b.index;
            });

            temp.forEach(function (o, i) {
                o.index = i;
            });
            temp = temp.concat([
                {
                    color: removed[0].color,
                    index: temp.length + 1,
                }
            ]);

            temp.sort(function (a, b) {
                return a.index < b.index;
            });

            localStorage.orderedColors = JSON.stringify(temp.map(removeHashkey));
            $scope.orderedColors = temp;
        };


        $scope.removeColor = function removeColor(color) {
            $scope.colors = $scope.colors.filter(function (a) {
                return a.color != color.color
            });

            $scope.orderedColors = $scope.orderedColors.filter(function (a) {
                return a.color != color.color
            });

            localStorage.colors = JSON.stringify($scope.colors.map(removeHashkey));
            localStorage.orderedColors = JSON.stringify($scope.orderedColors.map(removeHashkey));
        };
        $scope.checked = function checked(argument) {
            var indices = $scope.items.map(function (item, index) {
                return item.checked ? index : -1;
            }).filter(function (i) {
                return i != -1;
            });

            localStorage.indices = JSON.stringify(indices);
            var index = indices[0];
            localStorage.item = JSON.stringify({
                'en': $scope.contents.en.contents[index],
                'ar': $scope.contents.ar.contents[index],
                'fa': $scope.contents.fa.contents[index]
                //'af': $scope.contents.af.contents[index],
            });
        }
    })
    .controller('TextController', function TextController($scope, $state, $rootScope) {
        $rootScope.title = 'Text';

    });

/**/
