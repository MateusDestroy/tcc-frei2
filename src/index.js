import db from './db.js';
import express from 'express';
import cors from 'cors';
import path from 'path'




const app = new express()
app.use(cors())
app.use(express.json())


app.get('/clientes', async (req, resp) => {
    try {
        let users = await db.infoa_sti_cliente.findAll()

        resp.send(users)
        
    } catch (e) {
        resp.send({erro: e.toString()})
    }
});


app.get('/endereco', async (req, resp) => {
    try {
        let users = await db.infoa_sti_endereco.findAll()

        resp.send(users)
        
    } catch (e) {
        resp.send({erro: e.toString()})
    }
});




/// consultar produtos 





app.get('/clientes/:id', async (req, resp) => {
    let r = await db.infoa_sti_cliente.findOne({ where: { id_cliente: req.params.id}});
    resp.send(r);
});


// tela de login

app.post('/login', async (req, resp) => {


    let login = req.body;

    let p = await db.infoa_sti_cliente.findOne({
        where: {
            ds_email: login.email,
            ds_senha: login.senha
        },
        raw: true
    })

    if(p == null)
    return resp.send({erro: 'tudo errado'});

    resp.sendStatus(200);
});



// tela de cadastro
app.post('/cadastrar', async (req, resp) => {
    let x = req.body;
     
    try {
       
        const UsuarioCriado = await db.infoa_sti_cliente.create({
            nm_nome: x.nome,
            nm_sobrenome: x.sobrenome,
            ds_sexo: x.sexo,
            ds_cpf: x.cpf,
            dt_nascimento: x.nascimento,
            ds_email: x.email,
            ds_senha: x.senha
        })
        
 
        const EnderecoCriado = await db.infoa_sti_endereco.create({
            id_cliente: UsuarioCriado.id_cliente,
            ds_cep: x.cep,
            ds_endereco: x.endereco,
            nr_numero: x.numero,
            ds_complemento: x.complemento,
            ds_cidade: x.cidade
        })


    resp.sendStatus(200);

} catch (error) {
    resp.send( error.toString() )
}
});


app.post('/cadastrar/:id', async (req, resp) => {
    let x = req.body;
     
    try {
        const Endereco = await db.infoa_sti_endereco.create({
            id_cliente: req.params.id,
            ds_cep: x.cep,
            ds_endereco: x.endereco,
            nr_numero: x.numero,
            ds_complemento: x.complemento,
            ds_cidade: x.cidade
        })


    resp.sendStatus(200);

} catch (error) {
    resp.send( error.toString() )
}
});







app.put('/cliente/:id', async (req, resp) => {
    const {nome, sexo, cpf, nascimento, email, senha, cep, endereco, numero, complemento, cidade} =  req.body;
    let { id } = req.params;

    const End = await db.infoa_sti_endereco.update(
        {
        ds_cep: cep,
        ds_endereco: endereco,
        nr_endereco: numero,
        ds_complemento:  complemento,
        ds_cidade:  cidade
    }, 
    { 
        where: { id_endereco: id }
    });

    const Clientes = await db.infoa_sti_cliente.update({
        id_endereco: End.id_endereco,
        nm_nome: nome,
        ds_sexo: sexo,
        ds_cpf: cpf,
        dt_nascimento: nascimento,
        ds_email: email,
        ds_senha: senha
    },
    { 
        where: { id_cliente: id }
    
    })

    resp.sendStatus(200)


});




app.post('/cupom', async (req, resp) => {
    let x = req.body;
     
    try {
       
        const cupons = await db.infoa_sti_cupom.create({
            ds_nome_desconto: x.nome,
            vl_cupom: x.valor,
            bt_ativo: true,
        })

    resp.sendStatus(200);
} catch (error) {
    resp.send( error.toString() )
}
});

// cadastrar Produto


app.post('/produto', async (req, resp) => {
    
    try {
    const { imagem, produto, codigo, descricao, valor, estoqueMin, estoqueMax, estoqueAtual, sabor} = req.body;


    const xx = await db.infoa_sti_categoria.create({
        nm_sabor: sabor
    })

    const Produtos = await db.infoa_sti_produto.create({
        id_categoria: xx.id_categoria,
        img_produto: imagem,
        nm_produto: produto,
        ds_codigo_interno: codigo,
        ds_descricao: descricao,
        vl_valor: valor,
        nr_estoque_minimo: estoqueMin,
        nr_estoque_maximo: estoqueMax,
        nr_estoque_atual: estoqueAtual

    })

    resp.sendStatus(200);

} catch (error) {
    resp.send( error.toString() )
}

});








app.get('/produto', async (req, resp) => {


    const data = await db.infoa_sti_produto.findAll();

    
    resp.send(data);

});


// Alterar Produto 

app.put('/produto/:idProduto', async (req, resp) => {

    const { imagem, produto, codigo, descricao, valor, estoqueMin, estoqueMax, estoqueAtual, sabor} = req.body;


     
    const Sabor = await db.infoa_sti_categoria.update({
        nm_sabor: sabor
    },
    { 
        where: { id_produto: req.params.idProduto }
    })


    const Produtos = await db.infoa_sti_produto.update({
        id_categoria: Sabor.id_categoria,
        img_produto: imagem,
        nm_produto: produto,
        ds_codigo_interno: codigo,
        ds_descricao: descricao,
        vl_valor: valor,
        nr_estoque_minimo: estoqueMin,
        nr_estoque_maximo: estoqueMax,
        nr_estoque_atual: estoqueAtual

    },
    { 
        where: { id_produto: req.params.idProduto }
    })
});



// alterar informações do cliente



// Deletar Produto
app.delete('/produto', async (req, resp) => {
    let r = await db.infoa_sti_produto.destroy({
        where: {
            id_produto : req.params.idProduto
        } 
     })
     resp.sendStatus(200);
});




app.listen(process.env.PORT,
            console.log(`Servidor na Porta ${process.env.PORT}`));
