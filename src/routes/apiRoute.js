import routes from './index.js';

const route = (app) => {
    app.use('/user', routes.user);

    app.use('/student', routes.student);

    app.use('/group', routes.group);

    app.use('/tag', routes.tag);

    app.use('/problem', routes.problem);

    app.get('/', (req, res) => {
        return res.send('Received a GET HTTP method');
    });
        
    app.post('/', (req, res) => {
        return res.send('Received a POST HTTP method');
    });
    
    app.put('/', (req, res) => {
        return res.send('Received a PUT HTTP method');
    });
    
    app.delete('/', (req, res) => {
        return res.send('Received a DELETE HTTP method');
    });
}

export default route;