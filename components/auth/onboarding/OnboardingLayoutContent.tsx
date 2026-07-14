import Image from 'next/image';

const OnboardingLayoutContent = () => (
  <div className='text-white font-normal '>
    <div className='md:max-w-[461px] mt-8'>
      <h1 className='text-[36px] font-medium leading-[1.1] mb-3'>
        Become an IRPay <br /> Super Agent.
      </h1>

      <p className='text-[16px] leading-relaxed text-white/90 mb-12'>
        Take charge of your business. Build your own network of agents, process
        transactions, and earn commissions.
      </p>
    </div>

    <div className='relative bg-white/5 backdrop-blur-lg rounded-2xl p-8'>
      <div className='relative '>
        {/* Step 1 */}
        <div className='relative flex items-start'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 z-10'>
              <span className='text-sm font-semibold text-white'>
                {' '}
                <Image
                  alt='multipleuser'
                  width={24}
                  height={24}
                  src='/svg/multipleUser.svg'
                />
              </span>
            </div>
            <div className='w-[2px] h-[90px] bg-white/30' />
          </div>

          <div className='pl-6 pb-10'>
            <h3 className='font-semibold text-[18px] leading-snug'>
              Manage All Your Agents in One Place
            </h3>
            <p className='text-sm text-white/80 mt-2 leading-relaxed'>
              Add, track, and support your sub-agents easily. See who’s
              performing well and where they need help.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className='relative flex items-start'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 z-10'>
              <span className='text-sm font-semibold text-white'>
                {' '}
                <Image
                  alt='flash'
                  width={20}
                  height={20}
                  src='/svg/flash.svg'
                />
              </span>
            </div>
            <div className='w-[2px] h-[90px] bg-white/30' />
          </div>

          <div className='pl-6 '>
            <h3 className='font-semibold text-[18px] leading-snug'>
              Enjoy Fast Settlement & Real-Time Insights
            </h3>
            <p className='text-sm text-white/80 mt-2 leading-relaxed'>
              Empower agents with instant settlements, real-time visibility, and
              insights that help them scale faster.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className='relative flex items-start'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 z-10'>
              <span className='text-sm font-semibold text-white'>
                {' '}
                <Image
                  alt='coins'
                  width={24}
                  height={24}
                  src='/svg/coins.svg'
                />
              </span>
            </div>
          </div>

          <div className='pl-6'>
            <h3 className='font-semibold text-[18px] leading-snug'>
              More Commission As You Grow
            </h3>
            <p className='text-sm text-white/80 mt-2 leading-relaxed'>
              Earn more as you grow. Our system rewards super agents and their
              teams with transparent, flexible commissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OnboardingLayoutContent;
