import React from 'react';
import { DynamicRoute } from '@deity/falcon-front-kit';
import { Loader, NotFound } from '@deity/falcon-ui-kit';
import loadable from 'src/components/loadable';

const BlogPost = loadable(() => import(/* webpackChunkName: "blog/post" */ './blog/Post'));
const Category = loadable(() => import(/* webpackChunkName: "shop/category" */ './shop/Category/Category'));
const Product = loadable(() => import(/* webpackChunkName: "shop/product" */ './shop/Product'));

export default props => (
  <DynamicRoute
    {...props}
    loaderComponent={Loader}
    components={{
      'blog-post': BlogPost,
      'shop-category': Category,
      'shop-product': Product
    }}
    notFound={NotFound}
  />
);
