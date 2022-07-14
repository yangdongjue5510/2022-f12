import ProductDetail from '@/components/common/ProductDetail/ProductDetail';
import * as S from '@/pages/Product/Product.style';

import ReviewListSection from '@/components/ReviewListSection/ReviewListSection';
import useReviews from '@/hooks/useReviews';
import useProduct from '@/hooks/useProduct';
import { useParams } from 'react-router-dom';
import StickyWrapper from '@/components/common/StickyWrapper/StickyWrapper';
import ReviewBottomSheet from '@/components/ReviewBottomSheet/ReviewBottomSheet';
import { useReducer } from 'react';

function Product() {
  const { productId: id } = useParams();
  const productId = Number(id);

  const product = useProduct({ productId: Number(productId) });
  const [reviews, getNextPage, postReview] = useReviews({
    size: 6,
    productId,
  });

  const [isSheetOpen, toggleSheetOpen] = useReducer(
    (isSheetOpen: boolean) => !isSheetOpen,
    false
  );

  const handleReviewSubmit = async (reviewInput: ReviewInput) => {
    await postReview(reviewInput);
  };

  return (
    !!product && (
      <>
        <S.Container>
          <StickyWrapper>
            <ProductDetail
              imageUrl={product.imageUrl}
              name={product.name}
              rating={product.rating}
            />
          </StickyWrapper>
          <S.Wrapper>
            <S.FloatingButton onClick={toggleSheetOpen}>
              {isSheetOpen ? 'x' : '+'}
            </S.FloatingButton>
            <ReviewListSection
              columns={1}
              data={reviews}
              getNextPage={getNextPage}
            />
            {isSheetOpen && (
              <ReviewBottomSheet
                handleClose={toggleSheetOpen}
                handleSubmit={handleReviewSubmit}
              />
            )}
          </S.Wrapper>
        </S.Container>
      </>
    )
  );
}

export default Product;
