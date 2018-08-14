String.prototype.replaceAll = function (search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function onClickNewCategory(event, rootId) {
    document.querySelector('#categoryIdInput').value = null;

    if (rootId === undefined) {
        document.querySelector('#categoryParentInput').value = 'Root';
        document.querySelector('#categoryParentIdInput').value = null;
    } else {
        document.querySelector('#categoryParentInput').value = rootId;
        document.querySelector('#categoryParentIdInput').value = rootId;
    }
    document.querySelector('#btn-confirm-save').onclick = function () {
        console.log('category_id', category_id);
        // TODO: chamar a request do create
        $('#modalDeleteCategory').modal('hide')
    };
    // event.stopPropagation();
    return true;
}

function onClickCategory(event, id) {
    // TODO: Carregar os dados da categoria atual e preencher a tela (name e parent_id)

    document.querySelector('#categoryIdInput').value = id;
    document.querySelector('#btn-confirm-save').onclick = function () {
        console.log('category_id', category_id);
        // TODO: chamar a request do update
        $('#modalDeleteCategory').modal('hide')
    };
    // event.stopPropagation();
    return true;
}

function onClickDeleteCategory(event, category_id) {
    // TODO: trocar o conteúdo de #categoryToDeleteName pelo nome da categoria
    document.querySelector('#btn-confirm-delete').onclick = function () {
        console.log('category_id', category_id);
        // TODO: chamar a request do delete
        $('#modalDeleteCategory').modal('hide')
    };
    return true;
}

function loadCategories() {
    const table = document.querySelector('#tbody-categories');
    table.innerHTML = '';

    // TODO: realizar uma requisição para obter a lista das categorias
    const categories = [
        {
            id: 1,
            name: 'Frios',
            parent_id: null
        },
        {
            id: 2,
            name: 'Carnes meu ovo',
            parent_id: 1
        },
        {
            id: 3,
            name: 'Carnes Bovinas',
            parent_id: 2
        },
        {
            id: 9,
            name: 'Carnes de viado',
            parent_id: 2
        }
    ];

    for (let category of categories) {
        const template = [
            '      <th scope="row">{% id %}</th>',
            '      <td>{% name %}</td>',
            '      <td>{% parent_id %}</td>',
            '      <td>',
            '      <a href="#" class="btn btn-outline-success" role="button" data-toggle="modal"',
            '  data-target="#modalCreateCategory"',
            '  onclick="return onClickNewCategory(event, {% id %});">Add Children</a>',
            '  <a href="#" class="btn btn-outline-info" role="button" ' +
            '  data-toggle="modal" data-target="#modalCreateCategory"' +
            '  onclick="return onClickCategory(event, {% id %});">Edit</a>',
            '      <a href="#" class="btn btn-outline-danger" role="button"',
            '  data-toggle="modal"  data-target="#modalDeleteCategory"' +
            '  onclick="return onClickDeleteCategory(event, {% id %});"> Delete</a>',
            '      </td>'
        ].join("\n")
            .replaceAll('{% id %}', category.id)
            .replaceAll('{% name %}', category.name)
            .replaceAll('{% parent_id %}', category.parent_id || '');

        table.innerHTML += template;
    }
}

function initListener() {
    window.socket = io.connect('http://localhost:3001', {reconnect: true});
    socket.on('CATEGORY_CREATED', function (data) {
        loadCategories();
        console.log('CATEGORY_CREATED', data);
    });
    socket.on('CATEGORY_UPDATED', function (data) {
        loadCategories();
        console.log('CATEGORY_UPDATED', data);
    });
    socket.on('CATEGORY_DELETED', function (data) {
        loadCategories();
        console.log('CATEGORY_DELETED', data);
    });
}

$(function () {
    loadCategories();

    // TODO: ativar apenas quando o servidor estiver disponível
    // initListener();
});