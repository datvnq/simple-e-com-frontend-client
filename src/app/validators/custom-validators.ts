import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { map } from "rxjs";
import { AuthService } from "../services/auth.service";

export class CustomValidators {

    static notOnlyWhiteSpace(): ValidatorFn {
        return (control: AbstractControl) => {
            if ((control.value != null) && (control.value.trim().length == 0)) {
                return { notOnlyWhiteSpace: true };
            }
            else {
                return null;
            }
        }
    }

    static usernameValidator(authService: AuthService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return authService.getAllUsers()
                .pipe(
                    map(result => {
                        const username = result.find(result => result.username.toLowerCase() == control.value.toLowerCase());
                        return username ? { usernameExist: true } : null;
                    })
                )
        }
    }

}