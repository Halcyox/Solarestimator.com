# Solar Estimator CSS Structure

This directory contains all the CSS styles for the Solar Estimator application, organized in a simplified structure.

## Directory Structure

```
styles/
└── globals.css        # Main style entry point with all component styles
```

## CSS Approach

The application uses a single globals.css file containing all needed styles to avoid issues with Tailwind CSS directives being processed independently across multiple files.

### BEM Naming Convention

The CSS follows the BEM (Block, Element, Modifier) naming convention:

- Block: The main component (e.g., `.form-field`)
- Element: Parts of the component (e.g., `.form-field__label`)
- Modifier: Variations of elements (e.g., `.form-field__input--error`)

### Tailwind CSS Integration

The CSS uses Tailwind CSS `@apply` directives to leverage the utility classes defined in the project's Tailwind configuration. This approach provides consistency while maintaining component-specific styling.

## Adding New Components

When adding new component styles:

1. Add the styles to the globals.css file
2. Use BEM naming conventions
3. Use Tailwind's `@apply` for styling
4. Group related styles together by component 