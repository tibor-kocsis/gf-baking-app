import { Card } from './Card';
import { CategoryTitle } from './Typography';
import { IngredientRow } from './IngredientRow';

// One group of weighed lines under a small title: rows are IngredientRow props
// plus a `key`. `children` go under the rows (hints about the group).
export function IngredientCard({ title, rows, children }) {
  return (
    <Card>
      <CategoryTitle>{title}</CategoryTitle>
      {rows.map(({ key, ...row }, index) => (
        <IngredientRow key={key} {...row} last={index === rows.length - 1 && !children} />
      ))}
      {children}
    </Card>
  );
}
