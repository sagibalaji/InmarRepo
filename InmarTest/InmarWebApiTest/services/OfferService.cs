using InmarWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InmarWeb.services
{
    public class OfferService: IOfferService
    {
        private List<Product> Inventory { get; set; }

        private List<Product> addProdcuts()
        {
            Inventory = new List<Product>();
            Inventory.Add(new Product("p1", 1000, "p1 Desc"));
            Inventory.Add(new Product("p2", 200, "p2 Desc"));
            Inventory.Add(new Product("p3", 400, "p3 Desc"));
            Inventory.Add(new Product("p4", 700, "p4 Desc"));
            Inventory.Add(new Product("p5", 600, "p5 Desc"));
            Inventory.Add(new Product("p6", 800, "p6 Desc"));

            return Inventory;
        }

        public List<Product> GetAllProducts()
        {
            return Inventory;
        }

        public List<Offer> GetTodaysOffers()
        {
            addProdcuts();
            List<Offer> offers = new List<Offer>()
            {
                new Offer("ComboPackage1", Inventory.GetRange(0, 3)),
                new Offer("ComboPackage2", Inventory.GetRange(1, 3)),
                new Offer("ComboPackage3", Inventory.GetRange(2, 3)),
                new Offer("ComboPackage4", Inventory.GetRange(0, 3)),
            };

            return offers;
        }

    }
}