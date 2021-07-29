Select * from Customer where name like '%joe';

select * from Product p join OrderProduct op on p.orderid = op.orderid
join Order o on op.orderid = o.orderid 
join Customer c on op.customerid = c.customerid
where name like '%joe' and o.OrderDate > '11/1/2016';


select sum(price) from Product p join OrderProduct op on p.orderid = op.orderid
join Order o on op.orderid = o.orderid 
join Customer c on op.customerid = c.customerid
where name like '%joe';

Select Name, ordercount from Customer c join 
(
	Select count(*), coustomerid from Order o group by coustomerid
	having count(*) > 1
)oc
where c.coustomerid = c.coustomerid