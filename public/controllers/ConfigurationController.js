((angular) => {
    const app = angular.module("app");

    app.controller("ConfigurationController", function ($scope, $http) {
        $scope.data = {
            configuration: null,
            original: null
        };

        $http.get(`/api/configuration`)
            .then(response => {
                $scope.data.configuration = response.data || null;
                $scope.data.original = { ...$scope.data.configuration };
            });

        $scope.isChanged = function () {
            return $scope.data.configuration ? !Object.keys($scope.data.configuration).every(key => {
                return $scope.data.original[key] === $scope.data.configuration[key];
            }) : false;
        };

        $scope.updateConfiguration = function () {
            $http.post(`/api/configuration`, { configuration: $scope.data.configuration })
                .then(response => {
                    $scope.data.configuration = response.data || null;
                    $scope.data.original = { ...$scope.data.configuration };
                });
        };
    });
})(window.angular);