((angular) => {
    const app = angular.module("app");

    app.controller("CategoriesController", function ($scope, $http, $state) {
        $scope.data = {
            categories: [],
            addDisabled: false
        };

        $http.get("/api/categories")
            .then(response => {
                $scope.data.categories = response.data.categories || [];
                $scope.data.categories.forEach(category => {
                    category.original = { ...category };
                });
            });

        function prepareForRequest(categories) {
            return categories.map(category => {
                delete category.original;
                delete category.isEdit;
                delete category.isNew;
                return category;
            });
        }

        $scope.addCategory = function () {
            if ($scope.data.addDisabled) {
                return;
            }

            $scope.data.categories.push({
                name: "Назва",
                isNew: true
            });
            $scope.data.addDisabled = true;
        };

        $scope.editCategory = function (category) {
            category.isEdit = true;
            $scope.data.addDisabled = true;
        };

        $scope.deleteCategory = function (category) {
            $http.delete(`/api/categories/${category.id}`)
                .then(() => {
                    $scope.data.categories = $scope.data.categories.filter(c => c.id !== category.id);
                });
        };

        $scope.openCategory = function (category) {
            if (category.isNew || category.isEdit) {
                return;
            }

            $state.go("records", {
                categoryId: category.id
            });
        };

        $scope.saveCategory = function (category) {
            if (category.isNew) {
                $http.post("/api/categories", prepareForRequest([category])[0])
                    .then(response => {
                        const index = $scope.data.categories.findIndex(c => c.name === category.name);
                        const updatedCategory = response.data;
                        $scope.data.categories.splice(index, 1, updatedCategory);
                        $scope.data.addDisabled = false;
                    });
            } else if (category.isEdit) {
                $http.put(`/api/categories/${category.id}`, prepareForRequest([category])[0])
                    .then(response => {
                        category.isEdit = false;
                        category.name = response.data.name;
                        $scope.data.addDisabled = false;
                    });
            }
        };

        $scope.cancelCategory = function (category) {
            if (category.isNew) {
                $scope.data.categories = $scope.data.categories.filter(c => !c.isNew);
                $scope.data.addDisabled = false;
                delete category.isNew;
            } else if (category.isEdit) {
                category.name = category.original.name;
                delete category.isEdit;
                $scope.data.addDisabled = false;
            }
        };
    });
})(window.angular);