@@include('model.js');
@@include('view.js');
@@include('controller.js');


const app = new Controller(new Model('https://todo.hillel.it', 'ptahs'), new View())
