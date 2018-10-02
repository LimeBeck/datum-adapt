<div class="card" style="width: 15rem;">
        <div id="add-element" class="card-header">
            Добавить элемент
        </div>
        <div id="add-element-card" class="card-body collapse">
            <form id="element-form">
                <div class="form-group">
                    <label for="add-name">Имя</label><br>
                    <input class="form-control" type="text" id="add-name" required>
                </div>
                <div class="form-group">
                    <label for="add-description">Описание</label>
                    <input class="form-control" type="text" id="add-description" required>
                </div>
                <div id="add-type" class="form-group">

                </div>
                <div class="form-group">
                    <label for="add-point-lat">Широта</label>
                    <input class="form-control" type="text" id="add-point-lat" required>
                    <label for="add-point-lon">Долгота</label>
                    <input class="form-control" type="text" id="add-point-lon" required>
                    <label>(Берутся из точки на карте)</label>
                </div>
                <br>
                <button class="btn btn-success" id="add-button" type="submit">Добавить</button>
                <button class="btn btn-primary float-right" id="clear-button" type="button">Очистить</button>
            </form>
        </div>
    </div>