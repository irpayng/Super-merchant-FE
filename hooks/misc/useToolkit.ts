import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store';

const useToolkit = () => {
   const useAppDispatch = useDispatch.withTypes<AppDispatch>()
   const useAppSelector = useSelector.withTypes<RootState>()

   const dispatch = useAppDispatch();
   const { user } = useAppSelector((state) => state.user);
   const userEmail = user?.user?.email

   return {
      user,
      dispatch,
      useAppSelector,
      userEmail,
   };
};

export default useToolkit;