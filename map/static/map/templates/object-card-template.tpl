<div id="object-card" class="card" style="width: 15rem;">
    <div class="card-header">
        <%= name %>
        <div id="show-type-region" class="float-right">

        </div>
    </div>

    <div id="card" class="card-body collapse">
        <p><%= description %></p>

    </div>
    <div id="card-footer" class="card-footer collapse">
        <button id="delete" class="btn btn-sm btn-outline-danger float-right">
            Удалить
        </button>
        <button id="change" class="btn btn-sm btn-outline-primary float-left">
            Изменить
        </button>
    </div>
</div>