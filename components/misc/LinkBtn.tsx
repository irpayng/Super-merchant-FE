import Link from 'next/link'
import React from 'react'

type Props = {
  route: string;
  text: string;
}

const LinkBtn = (props: Props) => {
  return (
    <Link
      href={props.route}
      className="text-cms-orange-10 underline">
      {props.text}
    </Link>
  )
}

export default LinkBtn