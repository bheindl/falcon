import { toGridTemplate } from '@deity/falcon-ui-kit';

export const CheckoutSectionHeaderLayoutArea = {
  icon: 'icon',
  title: 'title',
  summary: 'summary',
  button: 'button'
};

export const CheckoutSectionHeaderLayout = {
  checkoutSectionHeaderLayout: {
    lineHeight: 1,
    display: 'grid',
    gridGap: 'xs',
    // prettier-ignore
    gridTemplate: toGridTemplate([
      ['40px', '1fr', '1fr', '100px'],
      [CheckoutSectionHeaderLayoutArea.icon, CheckoutSectionHeaderLayoutArea.title, CheckoutSectionHeaderLayoutArea.summary, CheckoutSectionHeaderLayoutArea.button]
    ])
  }
};
