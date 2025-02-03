const express = require('express');
const bodyParser = require('body-parser');

const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

const port = 3000;


const supabaseUrl = "https://nprhjykkrfmyqqzvenpa.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/messages', async (req, res ) => {
    try{
        const { data, error } = await supabase.from('messages').select('*')
        res.json(data);
    } catch {
        res.status(500).json({error: 'error while fetching the messages'});
    }
})

app.get('/messages/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const {data,error} = await supabase.from('messages').select('*').eq('slackid', req.params.id)
        res.json(data);
    } catch {
        res.status(500).json({error: 'error while fetching the message'});
    }
})

app.get('/senders', async (req,res) => {
    try {
        const {data, error} = await supabase.from('messages').select('slackid, name')
        res.json(data);
    } catch {
        res.status(500).json({error: 'error while fetching the senders'});
    }
})

app.post('/sendmsg', async (req, res) => {
    try {
        const exists = await checkID(req.body.slackid);
        if (exists) {
            res.json("error: id already exists");
            return;
        }
        const {data, error} = await supabase.from('messages').insert([
            {slackid: req.body.slackid, name: req.body.name, message: req.body.message}
        ])
        res.json(data === null ? "success" : "error");
    } catch {
        res.status(500).json({error: 'error while sending the message'});
    }
})

async function checkID (id) {
    const {data, error} = await supabase.from('messages').select('slackid').eq('slackid', id)
    if (data.length > 0) {
        return true;
    }
}

app.listen(port, () => {
    console.log(`running on port ${port}`);
})