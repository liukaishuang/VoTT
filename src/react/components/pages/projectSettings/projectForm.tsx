import React from "react";
import Form from "react-jsonschema-form";
import { IConnection, IProject } from "../../../../models/applicationState.js";
import ConnectionPicker from "../../common/connectionPicker";
import TagsInput from "../../common/tagsInput/tagsInput";
import CustomField from "../../common/customField";
// tslint:disable-next-line:no-var-requires
const formSchema = require("./projectForm.json");
// tslint:disable-next-line:no-var-requires
const uiSchema = require("./projectForm.ui.json");

/**
 * Required properties for Project Settings form
 * project: IProject - project to fill form
 * connections: IConnection[] - array of connections to use in project
 * onSubmit: function to call on form submit
 */
export interface IProjectFormProps extends React.Props<ProjectForm> {
    project: IProject;
    connections: IConnection[];
    onSubmit: (project: IProject) => void;
}

/**
 * Project Form State
 * formData - data containing details of project
 * formSchema - json schema of form
 * uiSchema - json UI schema of form
 */
export interface IProjectFormState {
    formData: any;
    formSchema: any;
    uiSchema: any;
}

/**
 * Form for editing or creating VoTT projects
 */
export default class ProjectForm extends React.Component<IProjectFormProps, IProjectFormState> {
    private fields = {
        connection: CustomField(ConnectionPicker, (props) => {
            return {
                id: props.idSchema.$id,
                value: props.formData,
                connections: this.props.connections,
                onChange: props.onChange,
            };
        }),
        tagsInput: CustomField(TagsInput, (props) => {
            return {
                tags: props.formData,
                onChange: props.onChange,
            };
        }),
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            uiSchema: { ...uiSchema },
            formSchema: { ...formSchema },
            formData: {
                ...this.props.project,
            },
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    /**
     * Updates state if project from properties has changed
     * @param prevProps - previously set properties
     */
    public componentDidUpdate(prevProps) {
        if (prevProps.project !== this.props.project) {
            this.setState({
                formData: { ...this.props.project },
            });
        }
    }

    public render() {
        return (
            <Form
                fields={this.fields}
                schema={this.state.formSchema}
                uiSchema={this.state.uiSchema}
                formData={this.state.formData}
                onSubmit={this.onFormSubmit}>
            </Form>
        );
    }

    /**
     * Called when form is submitted
     */
    private onFormSubmit(args) {
        const project: IProject = {
            ...args.formData,
        };
        this.props.onSubmit(project);
    }
}
