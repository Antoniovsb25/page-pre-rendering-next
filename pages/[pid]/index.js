import React from "react";
import fs from "fs/promises";
import path from "path";

// import { Container } from './styles';

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  if (!loadedProduct) return <p>Loading...</p>;

  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;
  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

export async function getStaticPaths() {
  const data = await getData();
  const ids = data.products.map((product) => product.id);
  const parthsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    paths: parthsWithParams,
    fallback: true,
  };
}

export default ProductDetailPage;
