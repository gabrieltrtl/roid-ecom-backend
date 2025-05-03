// Função para avaliar se uma regra de desconto deve ser aplicada a um produto
function shouldApplyRule(rule, product) {
  if (rule.logic === 'none') return true;

  const checks = rule.conditions.map((cond) => {
    const fieldValue = String(product[cond.field] || '').toLowerCase();
    const condValue = String(cond.value || '').toLowerCase();

    switch (cond.operator) {
      case 'equals':
        return fieldValue === condValue;
      case 'contains':
        return fieldValue.includes(condValue);
      case 'gt':
        return Number(product[cond.field]) > Number(cond.value);
      case 'lt':
        return Number(product[cond.field]) < Number(cond.value);
      case 'gte':
        return Number(product[cond.field]) >= Number(cond.value);
      case 'lte':
        return Number(product[cond.field]) <= Number(cond.value);
      default:
        return false;
    }
  });

  return rule.logic === 'and'
    ? checks.every(Boolean)
    : checks.some(Boolean);
}

// Função para aplicar a primeira regra que bater no produto
function calculateDiscountedPrice(product, discountRules = []) {
  for (const rule of discountRules) {
    if (shouldApplyRule(rule, product)) {
      const basePrice = product.price;

      if (rule.type === 'percentage') {
        return Math.max(0, basePrice - (basePrice * rule.value) / 100);
      } else if (rule.type === 'fixed') {
        return Math.max(0, basePrice - rule.value);
      } else if (rule.type === 'override') {
        return Math.max(0, rule.value);
      }
    }
  }

  return product.price;
}

module.exports = {
  shouldApplyRule,
  calculateDiscountedPrice,
};
