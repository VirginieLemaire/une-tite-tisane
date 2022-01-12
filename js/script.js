const app = {
  state : {
    currenteffect : 'digestion',
    effects : [`digestion` ,`sommeil`],
    //liste des plantes
    plants : [
      {
        name: 'Verveine citronnelle',
        effect: 'digestion',
      },
      {
        name: 'Verveine citronnelle',
        effect: 'sommeil',
      },
      {
        name: 'Mélisse',
        effect: 'sommeil',
      },
      {
        name: 'Passiflore',
        effect: 'sommeil',
      },
    ],
  },

  

  init: function() {
    //créer l'interface
    app.createInterface();
  },

  //AJOUT DES ELEMENTS AU DOM
  /**
 * Fonction qui permet de créer toute l'interface
 */
  createInterface : function () {
  //récupérer le container en le plaçant à la base de l'app pour qu'il reste accessible en dehors de la fonction
  app.state.container = document.getElementById('app');
  
  //créer les éléments
  app.createParts();
  app.organiseMain();
  app.createForm();
  app.createCounter();
  app.createList();
  },

  //Créer les 2 grosses parties de l'interface
  /* La partie de gauche avec la photo, la partie de droite étant la partie principale du l'interface*/
  createParts: function () {
    const sideElement = app.createElement('div', app.state.container, {id: 'left-side'});
    const mainElement = app.createElement('main', app.state.container, {id : 'main'});
    //stocker l'élément dans le state
    app.state.main = document.getElementById('main');
  },

  organiseMain: function () {
    //3 parties : header, need, result
    const header = app.createElement('header', app.state.main, {id : 'header'});
    const h1 = app.createElement('h1', header);
    const h2 = app.createElement('h2', header);
    //ajouter le texte
    h1.textContent = 'Une p\'tite tisane ?';
    h2.textContent = 'Sélectionne un bienfait ci-dessous pour trouver une plante à utiliser';
    
    const need = app.createElement('div', app.state.main, {id: 'need'});
    const result = app.createElement('div', app.state.main, {id: 'result'});
    //stocker les éléments dans le state
    app.state.need = document.getElementById('need');
    app.state.result = document.getElementById('result');
  },
  
  //I) formulaire contenant un <select> pour choisir entre les différentes options
  /**
   * Fonction qui crée la structure du formulaire de type liste déroulante
   * et l'ajoute au DOM
   */
  createForm: function() {
    //1. le formulaire
    const formElement = app.createElement('form', app.state.need, {id : 'form'});
    //2. le <select>
    const selectElement = app.createElement('select', formElement,{id : 'select'});
    //3. ajouter les options au <select>
    app.state.effects.forEach(
      (effect) => {
        //créer les options du <select>
        const createOption = app.createElement('option', selectElement, {
          value : effect , 
          textContent : effect,
          selected : effect === app.state.currenteffect
        } );
      }
      );
    //écouter le changement sur le select
    selectElement.addEventListener('change', app.handleChange);
  },
  //II) compteur qui affiche le nombre de résultats
  /**
   * Fonction qui crée une DIV pour le compteur
   * et l'ajoute au DOM
   */
  createCounter: function() {
    app.createElement('div', app.state.result, { 
      id : 'count'
    });
  },

  //III) liste de plantes avec leur nom et un tag spécifiant leur effet principal
  /**
   * Fonction qui crée une liste non ordonnée représentant les résultats (plantes concernées et tags avec effet de la plante)
   * et l'ajoute au DOM
   */
  createList : function() {
    //1. ul
    const ul = app.createElement('ul', app.state.result, {className : 'list'});
    //2. <li> avec les noms des plantes
    //2.a ) préparer la fonction de création de <li>
    function createpPlantsList({name, effect, speciality}) {
      const li = app.createElement('li', ul, { 
        className : 'plant', 
        textContent : name
      });
      //tags
      app.createElement('span', li, {textContent : effect});
    }
    //2.b) filtrer les noms des plantes correspondant à la sélection
    const filter = (plant) => (plant.effect === app.state.currenteffect);
    const plantsResult = app.state.plants.filter(filter);
    //2.c) donner le nb de résultats au compteur
    document.getElementById('count').textContent = app.getCount(plantsResult.length);
    //2.d) éxécuter la fonction et lui donner les noms
    plantsResult.forEach(
      (plant) => {
        createpPlantsList(plant);
      }
    );
    
  },

  //FONCTION UTILES

  /**
   * Permet de créer un élément tout en le configurant
   * @param {String} tag élément à créer
   * @param {Element} parent référence à l'élément du DOM auquel rattacher cet élément
   * @param {Object} options objet qui va contenir l'ensemble des propriétés à appliquer
   * @return Element
   */
  createElement : function(tag, parent, options = {}) {
    //créer l'élément
    const element = document.createElement(tag);
    //configuration de l'élément
    for (const key in options) {
      element[key] = options[key];
    }
    //rattacher au parent
    parent.appendChild(element);

    //retourner l'élément créé
    return element;
  },

  /**
   * Permet de personnaliser la phrase affichée sur le compteur en fonction du nombre de résultats correspondant au <select>
   * @param {Number} count nombre de résultats correspondant (index du <select>)
   * @returns une phrase contenant le nombre de plantes correspondant au critère
   */  
  getCount : function (count) {
    if (count === 0) return "Aucune plante trouvée";
    if (count === 1) return "1 plante trouvée";
    return `${count} plantes trouvées`;
  },
  /**
   * Ecouteur d'évènement permettant de connaitre le filtre choisi par l'utilisateur
   * @param {*} event choix effectué par l'utilisateur sur le formulaire select
   */
  handleChange : function (event) {
    app.state.currenteffect = event.currentTarget.value;

    //réinitialiser l'interface
    app.state.container.textContent = "";
    app.createInterface();
  }
  
};

// on initialise l'app dès que le document est prêt
document.addEventListener('DOMContentLoaded', app.init);
