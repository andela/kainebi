# CSS Styleguide

The rules outlined in this document cascades downward. 

## Class Naming Convention

**S****ELECTORS**

**Namespacing**


- `.o-` : Signify that a selector is an Object. Modifications should be made with care since these are reused in different contexts
- `.c-` : Signify that a selector is a Component.
- `.u-` : Signify that a selector is a Utility class and has a single responsibility.
- `.is-, .has-` : Signify current state of UI.
- `.js-` : Signify a DOM hook for a Javascript binding. 
- `._` : Signify a hack. Avoid using this as much as possible. 

Bad
 `._o-layout  {} ` 
 
 Good

    .o-media {}
    .c-navigation {}
    



## **CSS**
## Formatting
- Use 2 spaces for indentation
- DO NOT use ID selectors
- Use dashes for class names i.e Use `.this-is-my-class-name {}` 
- Avoid descendant selectors i.e Don’t use  `.header h1 {}` 
- Avoid element and class attachments i.e Don’t use `h1.header {}` 
- Use `!important` very sparingly. If used, must be assigned a single responsibility within a utility class. 
- Leave a blank line between rule declarations
- Give each selector its own line even when using multiple selectors in a rule declaration
- Always leave a space before the opening brace `{` 
- Put a closing brace `}` of a rule declaration on a new line
- In properties, put a space after, but not before, the `:` character

Bad
`ul, li, a {}` 

Good 

    ul,
    li,
    a {}
    


## **BEM **

`.block {} ` - Styles the top-level ‘Block’ of a component. 
`.block__element {}` - Styles an ‘Element’ of the larger Block.
`.block__element--modifier {} ` - Styles a ‘Modifier’ of the Block.


Bad


    <header class="block">
        <h1 class="block__elem1">
            <a class="block__elem1__elem2" href="/">clubmate.fi</a>
        </h1>
    </header>

 -Don’t go so deep `.block__elem1__elem2`, don’t try to mimic the DOM tree. Nested html-elements is a DOM-tree. The names of the classes you write is a BEM-tree. Feel the difference!
 

    .media_logo-image{}

Good


    <header class="block">
        <h1 class="block__elem1">
            <a class="block__elem2" href="/">clubmate.fi</a>
        </h1>
    </header>

A real life example would be :

    <ul class="menu">
      <li class="menu__item">
        <a class="menu__link">
          <span class="menu__text"></span>
        </a>
      </li>
    </ul>


## **SCSS**
- Avoid nesting more 3 levels deep

Bad


    .body{
     .media{
      .container{
       .column{
       }
      }
     }
    }

Good 


    .media {
      &__logo {
        color: red;
        height: .2rem;
      
        &--small {
          font-size: 1rem
        }
      }
    }
## **OOCSS
**
According to Nicole Sullivan, OOCSS is based on two principles:

1. Separate Structure and Skin
2. Separate Container and Content

Bad


    

Good


    



Thanks to 

- Harry at [CSSWizardry](http://csswizardry.com). 
  - [MindBEMding - getting your head ‘round BEM syntax](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
  - [More Transparent UI Code with Namespaces](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)
  - [BEMIT: Taking the BEM Naming Convention a Step Further](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- [Nicolas Gallangher](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/)
- [Nicole Sullivan](https://github.com/stubbornella/oocss/wiki)
- [Smashing Mag](https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/)
- [Airbnb’s CSS Styleguide](https://github.com/airbnb/css)






