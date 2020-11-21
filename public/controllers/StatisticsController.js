((angular, _) => {
    const app = angular.module("app");

    app.controller("StatisticsController", function ($scope, $http) {
        $scope.data = {
            statistics: [],
            sortColumns: [],
            sortDirections: []
        };

        function calculateStatisticsDifference (statistics) {
            statistics.forEach(stat => {
                stat.viewsDifference = parseInt(stat.views || 0) - parseInt(stat.lastViews || 0);
                stat.phonesDifference = parseInt(stat.phones || 0) - parseInt(stat.lastPhones || 0);
                stat.messagesDifference = parseInt(stat.messages || 0) - parseInt(stat.lastMessages || 0);
                stat.chosensDifference = parseInt(stat.chosens || 0) - parseInt(stat.lastChosens || 0);
            });

            return statistics;
        }

        $http.get("/api/statistics").then(response => {
            $scope.data.statistics = calculateStatisticsDifference(response.data.statistics || []);
            $scope.data.sortColumns.push("dateOfChecking");
            $scope.data.sortDirections.push("desc");
            $scope.data.statistics = _.orderBy($scope.data.statistics, $scope.data.sortColumns, $scope.data.sortDirections);
        });

        $scope.formatDate = function (date) {
            const dateObj = new Date(date);
            const year = "" + dateObj.getFullYear();
            const month = dateObj.getMonth();
            const day = dateObj.getDate();
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes();
            const seconds = dateObj.getSeconds();
            return `${day}.${month + 1}.${year.slice(2)}/${hours}:${minutes}:${seconds}`;
        };

        $scope.getSortIcon = function (column) {
            const foundIndex = $scope.data.sortColumns.findIndex(c => c === column);
            if (foundIndex !== -1) {
                const order = $scope.data.sortDirections[foundIndex];
                return order === "asc" ? "⇧" : "⇩";
            }
            return "⇳";
        };

        $scope.sortBy = function (column) {
            const foundIndex = $scope.data.sortColumns.findIndex(c => c === column);
            if (foundIndex !== -1) {
                const order = $scope.data.sortDirections[foundIndex];
                if (order === "desc") {
                    $scope.data.sortDirections[foundIndex] = "asc";
                } else {
                    $scope.data.sortColumns.splice(foundIndex, 1);
                    $scope.data.sortDirections.splice(foundIndex, 1);
                }
            } else {
                $scope.data.sortColumns.push(column);
                $scope.data.sortDirections.push("desc");
            }

            $scope.data.statistics = _.orderBy($scope.data.statistics, $scope.data.sortColumns, $scope.data.sortDirections);
        };

        $scope.collectStatistics = function () {
            $http.post("/api/statistics", { writeToExcel: false });
        };

        $scope.storeToExcel = function () {
            $http.post("/api/statistics", { writeToExcel: true, getFromDb: true });
        };

        $scope.collectAndStore = function () {
            $http.post("/api/statistics", { writeToExcel: true });
        };
    });
})(window.angular, window._);