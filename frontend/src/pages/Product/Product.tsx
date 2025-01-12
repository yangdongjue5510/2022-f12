import { useReducer, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import * as S from '@/pages/Product/Product.style';

import AsyncWrapper from '@/components/common/AsyncWrapper/AsyncWrapper';
import BarGraph from '@/components/common/BarGraph/BarGraph';
import FloatingButton from '@/components/common/FloatingButton/FloatingButton';
import Loading from '@/components/common/Loading/Loading';
import StickyWrapper from '@/components/common/StickyWrapper/StickyWrapper';

import ProductDetail from '@/components/Product/ProductDetail/ProductDetail';
import ReviewBottomSheet from '@/components/Review/ReviewBottomSheet/ReviewBottomSheet';
import ReviewListSection from '@/components/Review/ReviewListSection/ReviewListSection';

import useAnimation from '@/hooks/useAnimation';
import useAuth from '@/hooks/useAuth';
import useDevice from '@/hooks/useDevice';
import useModal from '@/hooks/useModal';
import useProduct from '@/hooks/useProduct';
import useReviews from '@/hooks/useReviews';
import useStatistics from '@/hooks/useStatistics';

import Writing from '@/assets/writing.svg';

export const PRODUCT_PAGE_REVIEW_SIZE = 6;

function Product() {
  const { isLoggedIn } = useAuth();
  const { productId: id } = useParams();
  const productId = Number(id);
  const { device } = useDevice();

  const [product, isProductReady, isProductError, refetchProduct] = useProduct({
    id: Number(productId),
  });
  const [statistics, isStatisticsReady, isStatisticsError, refetchStatistics] =
    useStatistics({
      productId: Number(productId),
    });
  const {
    reviews,
    isLoading: isReviewLoading,
    isReady: isReviewReady,
    isError: isReviewError,
    getNextPage,
    handleSubmit: handleReviewSubmit,
    handleEdit: handleReviewEdit,
    handleDelete: handleReviewDelete,
  } = useReviews({
    size: String(PRODUCT_PAGE_REVIEW_SIZE),
    productId,
    handleRefetchOnSuccess: () => {
      refetchProduct();
      refetchStatistics();
    },
  });

  const reviewRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    reviewRef.current.focus();
  };

  const [isSheetOpen, toggleSheetOpen] = useReducer((isSheetOpen: boolean) => {
    if (!isLoggedIn) return false;

    return !isSheetOpen;
  }, false);

  const [shouldSheetRender, handleSheetUnmount, sheetAnimationTrigger] =
    useAnimation(isSheetOpen);

  const { showAlert } = useModal();

  const showAlertHandler = async () => {
    await showAlert('리뷰를 작성하려면 로그인 해주세요.');
  };

  useEffect(() => {
    if (!isLoggedIn) toggleSheetOpen();
  }, [isLoggedIn]);
  const ProductDetails = (
    <S.ProductDetailWrapper>
      <AsyncWrapper
        fallback={<Loading />}
        isReady={isProductReady}
        isError={isProductError}
      >
        <ProductDetail product={product} />
      </AsyncWrapper>
      <AsyncWrapper
        fallback={<Loading />}
        isReady={isStatisticsReady}
        isError={isStatisticsError}
      >
        <BarGraph statistics={statistics} />
      </AsyncWrapper>
    </S.ProductDetailWrapper>
  );

  return (
    <S.Container>
      {device === 'desktop' ? (
        <StickyWrapper>{ProductDetails}</StickyWrapper>
      ) : (
        ProductDetails
      )}
      <S.ReviewListWrapper tabIndex={0} ref={reviewRef}>
        <FloatingButton
          label={'리뷰 작성하기'}
          clickHandler={isLoggedIn ? toggleSheetOpen : showAlertHandler}
        >
          <Writing />
        </FloatingButton>
        <AsyncWrapper
          fallback={<Loading />}
          isReady={isReviewReady}
          isError={isReviewError}
        >
          <ReviewListSection
            columns={1}
            data={reviews}
            getNextPage={getNextPage}
            handleDelete={handleReviewDelete}
            handleEdit={handleReviewEdit}
            handleFocus={handleFocus}
            isLoading={isReviewLoading}
            isError={isReviewError}
            pageSize={PRODUCT_PAGE_REVIEW_SIZE}
          />
        </AsyncWrapper>
        {shouldSheetRender && (
          <ReviewBottomSheet
            handleClose={toggleSheetOpen}
            handleSubmit={handleReviewSubmit}
            handleUnmount={handleSheetUnmount}
            animationTrigger={sheetAnimationTrigger}
            handleFocus={handleFocus}
            isEdit={false}
          />
        )}
      </S.ReviewListWrapper>
    </S.Container>
  );
}

export default Product;
