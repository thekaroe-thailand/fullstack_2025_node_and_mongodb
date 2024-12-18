const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const port = 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/check-db-connection", async (req, res) => {
    try {
        await prisma.$connect();
        res.send({ message: "Connected to the database" });
    } catch (error) {
        res.status(500).send({ error: "Cannot connect to database" });
    }
});

app.post('/customer/create', async (req, res) => {
    try {
        const payload = req.body;
        const customer = await prisma.customer.create({
            data: payload
        });
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/list', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany();
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/detail/:id', async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: {
                id: req.params.id
            }
        });
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.put('/customer/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        const customer = await prisma.customer.update({
            where: {
                id: id
            },
            data: payload
        });
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.delete('/customer/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.customer.delete({
            where: {
                id: id
            }
        });
        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/startsWith', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    startsWith: keyword
                }
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/endsWith', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    endsWith: keyword
                }
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// contains
app.get('/customer/contains', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    contains: keyword  // LIKE '%keyword%'
                }
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/sortByName', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/whereAnd', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: 'i'
                        }
                    },
                    {
                        credit: {
                            gt: 0
                        }
                    }
                ]
            }
        });

        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/listBetweenCredit', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                credit: {
                    gt: 150000, // > 150000
                    lt: 310000 // < 310000
                }
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/sumCredit', async (req, res) => {
    try {
        const sumCredit = await prisma.customer.aggregate({
            _sum: {
                credit: true
            }
        });
        res.json({ sumCredit: sumCredit._sum.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/maxCredit', async (req, res) => {
    try {
        const maxCredit = await prisma.customer.aggregate({
            _max: {
                credit: true
            }
        });
        res.json({ maxCredit: maxCredit._max.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/minCredit', async (req, res) => {
    try {
        const minCredit = await prisma.customer.aggregate({
            _min: {
                credit: true
            }
        });
        res.json({ minCredit: minCredit._min.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/avgCredit', async (req, res) => {
    try {
        const avgCredit = await prisma.customer.aggregate({
            _avg: {
                credit: true
            }
        });
        res.json({ avgCredit: avgCredit._avg.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/countCustomer', async (req, res) => {
    try {
        const count = await prisma.customer.count();
        res.json({ countCustomer: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post('/order/create', async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const amount = req.body.amount;
        const order = await prisma.order.create({
            data: {
                customerId: customerId,
                amount: amount
            }
        });
        res.json(order);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/listOrder/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await prisma.order.findMany({
            where: {
                customerId: customerId
            }
        });
        res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/listAllOrder', async (req, res) => {
    try {
        const orders = await prisma.customer.findMany({
            include: {
                Order: true
            }
        });
        res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/listOrderAndProduct/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const customers = await prisma.customer.findMany({
            where: {
                id: customerId
            },
            include: {
                Order: {
                    include: {
                        Product: true
                    }
                }
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
