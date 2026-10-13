/* Le Bistro by IT Step: a snapshot of the public teaching API (srmsapi.stepacademy.ge), taken Oct 2026.
   Used for offline replays in the slides. The live API can change: students add dishes through the admin endpoints. */
window.BISTRO = {
 "api": "https://srmsapi.stepacademy.ge",
 "site": "https://srms.stepacademy.ge",
 "categories": [
  {
   "id": 1,
   "slug": "starters",
   "nameEn": "Starters",
   "nameKa": "პირველი კერძები",
   "sortOrder": 1,
   "dishCount": 7
  },
  {
   "id": 2,
   "slug": "main-courses",
   "nameEn": "Main Courses",
   "nameKa": "მთავარი კერძები",
   "sortOrder": 2,
   "dishCount": 6
  },
  {
   "id": 3,
   "slug": "pastries",
   "nameEn": "Bakery & Pastries",
   "nameKa": "ცომეული და ნამცხვრები",
   "sortOrder": 3,
   "dishCount": 3
  },
  {
   "id": 4,
   "slug": "desserts",
   "nameEn": "Desserts",
   "nameKa": "დესერტები",
   "sortOrder": 4,
   "dishCount": 6
  },
  {
   "id": 5,
   "slug": "drinks",
   "nameEn": "Drinks",
   "nameKa": "სასმელები",
   "sortOrder": 5,
   "dishCount": 6
  }
 ],
 "dishes": [
  {
   "id": 1,
   "name": "French Onion Soup",
   "description": "Caramelized onion broth baked under a gruyère crouton crust.",
   "price": 14.5,
   "categorySlug": "starters",
   "categoryName": "Starters",
   "imageUrl": "/images/french-onion-soup.jpg",
   "isAvailable": true
  },
  {
   "id": 2,
   "name": "Escargots de Bourgogne",
   "description": "Six Burgundy snails in garlic-parsley butter.",
   "price": 22,
   "categorySlug": "starters",
   "categoryName": "Starters",
   "imageUrl": "/images/escargots.jpg",
   "isAvailable": true
  },
  {
   "id": 3,
   "name": "Salade Niçoise",
   "description": "Tuna, green beans, olives, egg and anchovies over crisp lettuce.",
   "price": 18,
   "categorySlug": "starters",
   "categoryName": "Starters",
   "imageUrl": "/images/salade-nicoise.jpg",
   "isAvailable": true
  },
  {
   "id": 4,
   "name": "Quiche Lorraine",
   "description": "Buttery tart of smoked bacon, cream and gruyère.",
   "price": 15,
   "categorySlug": "starters",
   "categoryName": "Starters",
   "imageUrl": "/images/quiche-lorraine.jpg",
   "isAvailable": true
  },
  {
   "id": 5,
   "name": "Coq au Vin",
   "description": "Chicken braised slowly in red wine with mushrooms and pearl onions.",
   "price": 32,
   "categorySlug": "main-courses",
   "categoryName": "Main Courses",
   "imageUrl": "/images/coq-au-vin.jpg",
   "isAvailable": true
  },
  {
   "id": 6,
   "name": "Ratatouille",
   "description": "Provençal layered vegetables in tomato-herb sauce.",
   "price": 24,
   "categorySlug": "main-courses",
   "categoryName": "Main Courses",
   "imageUrl": "/images/ratatouille.jpg",
   "isAvailable": true
  },
  {
   "id": 7,
   "name": "Boeuf Bourguignon",
   "description": "Beef stewed in Burgundy wine with lardons and carrots.",
   "price": 38,
   "categorySlug": "main-courses",
   "categoryName": "Main Courses",
   "imageUrl": "/images/boeuf-bourguignon.jpg",
   "isAvailable": true
  },
  {
   "id": 8,
   "name": "Duck Confit",
   "description": "Slow-cured duck leg with crispy skin and garlic potatoes.",
   "price": 36,
   "categorySlug": "main-courses",
   "categoryName": "Main Courses",
   "imageUrl": "/images/duck-confit.jpg",
   "isAvailable": true
  },
  {
   "id": 9,
   "name": "Bouillabaisse",
   "description": "Marseille fish stew with rouille and toasted baguette.",
   "price": 42,
   "categorySlug": "main-courses",
   "categoryName": "Main Courses",
   "imageUrl": "/images/bouillabaisse.jpg",
   "isAvailable": true
  },
  {
   "id": 10,
   "name": "Steak Frites",
   "description": "Pan-seared entrecôte, herb butter, thin golden fries.",
   "price": 39,
   "categorySlug": "main-courses",
   "categoryName": "Main Courses",
   "imageUrl": "/images/steak-frites.jpg",
   "isAvailable": true
  },
  {
   "id": 12,
   "name": "Pain au Chocolat",
   "description": "Flaky pastry wrapped around two batons of dark chocolate.",
   "price": 7.5,
   "categorySlug": "pastries",
   "categoryName": "Bakery & Pastries",
   "imageUrl": "/images/pain-au-chocolat.jpg",
   "isAvailable": true
  },
  {
   "id": 13,
   "name": "Brioche",
   "description": "Golden egg-and-butter loaf, soft as a cloud.",
   "price": 8,
   "categorySlug": "pastries",
   "categoryName": "Bakery & Pastries",
   "imageUrl": "/images/brioche.jpg",
   "isAvailable": true
  },
  {
   "id": 14,
   "name": "Baguette Tradition",
   "description": "Crackling crust, open crumb — baked twice daily.",
   "price": 5,
   "categorySlug": "pastries",
   "categoryName": "Bakery & Pastries",
   "imageUrl": "/images/baguette.jpg",
   "isAvailable": true
  },
  {
   "id": 15,
   "name": "Crème Brûlée",
   "description": "Vanilla custard under a torched caramel shell.",
   "price": 13,
   "categorySlug": "desserts",
   "categoryName": "Desserts",
   "imageUrl": "/images/creme-brulee.jpg",
   "isAvailable": true
  },
  {
   "id": 16,
   "name": "Crêpes Suzette",
   "description": "Thin crêpes flambéed with orange-Grand Marnier butter.",
   "price": 16,
   "categorySlug": "desserts",
   "categoryName": "Desserts",
   "imageUrl": "/images/crepes-suzette.jpg",
   "isAvailable": true
  },
  {
   "id": 17,
   "name": "Tarte Tatin",
   "description": "Upside-down caramelized apple tart with crème fraîche.",
   "price": 14,
   "categorySlug": "desserts",
   "categoryName": "Desserts",
   "imageUrl": "/images/tarte-tatin.jpg",
   "isAvailable": true
  },
  {
   "id": 18,
   "name": "Éclair au Chocolat",
   "description": "Choux pastry filled with chocolate crème pâtissière.",
   "price": 9.5,
   "categorySlug": "desserts",
   "categoryName": "Desserts",
   "imageUrl": "/images/eclair.jpg",
   "isAvailable": true
  },
  {
   "id": 19,
   "name": "Macarons (6 pcs)",
   "description": "Assorted almond meringue shells with silky ganache.",
   "price": 15,
   "categorySlug": "desserts",
   "categoryName": "Desserts",
   "imageUrl": "/images/macarons.jpg",
   "isAvailable": true
  },
  {
   "id": 20,
   "name": "Mousse au Chocolat",
   "description": "Dark chocolate mousse with fleur de sel.",
   "price": 12,
   "categorySlug": "desserts",
   "categoryName": "Desserts",
   "imageUrl": "/images/mousse-au-chocolat.jpg",
   "isAvailable": true
  },
  {
   "id": 21,
   "name": "Bordeaux Rouge (glass)",
   "description": "House red — round, dark fruit, soft tannins.",
   "price": 16,
   "categorySlug": "drinks",
   "categoryName": "Drinks",
   "imageUrl": "/images/bordeaux-rouge.jpg",
   "isAvailable": true
  },
  {
   "id": 22,
   "name": "Chablis (glass)",
   "description": "Crisp, mineral white Burgundy.",
   "price": 18,
   "categorySlug": "drinks",
   "categoryName": "Drinks",
   "imageUrl": "/images/chablis.jpg",
   "isAvailable": true
  },
  {
   "id": 23,
   "name": "Champagne Brut (glass)",
   "description": "Fine bubbles, brioche notes, celebration included.",
   "price": 25,
   "categorySlug": "drinks",
   "categoryName": "Drinks",
   "imageUrl": "/images/champagne-brut.jpg",
   "isAvailable": true
  },
  {
   "id": 24,
   "name": "Café au Lait",
   "description": "Rich espresso with steamed milk in a wide cup.",
   "price": 7,
   "categorySlug": "drinks",
   "categoryName": "Drinks",
   "imageUrl": "/images/cafe-au-lait.jpg",
   "isAvailable": true
  },
  {
   "id": 25,
   "name": "Espresso",
   "description": "Short, dark and serious.",
   "price": 5,
   "categorySlug": "drinks",
   "categoryName": "Drinks",
   "imageUrl": "/images/espresso.jpg",
   "isAvailable": true
  },
  {
   "id": 26,
   "name": "Citron Pressé",
   "description": "Fresh-squeezed lemon, still water, sugar on the side.",
   "price": 8,
   "categorySlug": "drinks",
   "categoryName": "Drinks",
   "imageUrl": "/images/citron-presse.jpg",
   "isAvailable": true
  }
 ]
};
