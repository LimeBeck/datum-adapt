<div class="card" style="width: 15rem;">
    <div class="card-header">
        Изменить элемент
    </div>
    <div class="card-body">
        <form id="change-form">
            <div>
                <label for="change-name">Имя</label><br>
                <input class="form-control" type="text" id="change-name" required value="<%= name %>">
            </div>
            <div>
                <label for="change-description">Описание</label>
                <input class="form-control" type="text" id="change-description" required value="<%= description %>">
            </div>
            <div id="show-type-region">

            </div>
            <div>
                <label for="change-point-lat">Широта</label>
                <input class="form-control" type="text" id="change-point-lat" required
                       value="<%= geom.coordinates[0] %>">
                <label for="change-point-lon">Долгота</label>
                <input class="form-control" type="text" id="change-point-lon" required
                       value="<%= geom.coordinates[1] %>">
                <label>(Берутся из точки на карте)</label>
            </div>
            <br>
            <button class="btn btn-sm btn-outline-success float-left" id="change-button" type="submit">Сохранить
            </button>
            <button class="btn btn-sm btn-outline-primary float-right" id="cancel-button">Отмена</button>
        </form>
    </div>
</div>