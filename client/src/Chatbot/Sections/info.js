import React from 'react'
import { Card, Icon } from 'antd';
// Card형 대화에 대한 템플릿 작성
const { Meta } = Card;

// text형 대화에 대한 템플릿 작성
function InfoComponent(props) {
    console.log('1');
    return (
        <Card
            style={{ width: 300 }}
            actions={[
                <a target="_blank" rel="noopener noreferrer" href={props.description.actionLink.stringValue}>
                    <Icon type="ellipsis" key="ellipsis" />
                </a>
            ]}
        >
            <Meta
                title={props.description.title.stringValue}
                description={props.description.subtitle.stringValue}
            />

        </Card>
    )
}

export default InfoComponent